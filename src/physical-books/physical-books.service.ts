import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CopyStatus } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { createBookCopies, recalcBookStock } from '../utils/copies';

@Injectable()
export class PhysicalBooksService {
  constructor(private prisma: PrismaService) { }

  private async resolveAuthorIds(tx: any, ids: string[] = [], names: string[] = []): Promise<string[]> {
    const resolved: string[] = [];

    for (const id of ids) {
      if (id && !resolved.includes(id)) resolved.push(id);
    }

    for (const name of names) {
      const cleaned = `${name}`.trim();
      if (!cleaned) continue;

      let author = await tx.author.findFirst({
        where: { name: { equals: cleaned, mode: 'insensitive' } }
      });

      if (!author) {
        author = await tx.author.create({ data: { name: cleaned } });
      }

      if (!resolved.includes(author.id)) resolved.push(author.id);
    }

    return resolved;
  }

  private async resolveCategoryIds(tx: any, ids: string[] = [], names: string[] = []): Promise<string[]> {
    const resolved: string[] = [];

    for (const id of ids) {
      if (id && !resolved.includes(id)) resolved.push(id);
    }

    for (const name of names) {
      const cleaned = `${name}`.trim();
      if (!cleaned) continue;

      let category = await tx.category.findFirst({
        where: { name: { equals: cleaned, mode: 'insensitive' } }
      });

      if (!category) {
        category = await tx.category.create({ data: { name: cleaned } });
      }

      if (!resolved.includes(category.id)) resolved.push(category.id);
    }

    return resolved;
  }

  /**
   * Crea ejemplares para un libro respetando códigos solicitados y
   * autogenerando los restantes. Devuelve las copias creadas.
   */
  private async createCopies(
    tx: any,
    book: { id: string; isbn?: string | null },
    quantity: number,
    requestedCodes: string[] = [],
    extra: { location?: string | null; observations?: string | null } = {}
  ) {
    return createBookCopies(tx, book, quantity, requestedCodes, extra);
  }

  /**
   * Reconcilia el número de ejemplares activos con un total objetivo.
   * Devuelve false cuando el libro no tiene ejemplares (modo legacy).
   */
  private async reconcileCopies(
    tx: any,
    book: { id: string; isbn?: string | null },
    targetTotal: number,
    requestedCodes: string[] = []
  ): Promise<boolean> {
    const copies = await tx.bookCopy.findMany({
      where: { bookId: book.id },
      orderBy: { createdAt: 'asc' }
    });

    if (copies.length === 0) return false;

    const active = copies.filter((c: any) => c.status !== CopyStatus.BAJA);
    const loaned = active.filter((c: any) => c.status === CopyStatus.PRESTADO);
    const diff = targetTotal - active.length;

    if (diff > 0) {
      await this.createCopies(tx, book, diff, requestedCodes);
    } else if (diff < 0) {
      const removable = active.filter((c: any) => c.status !== CopyStatus.PRESTADO);
      if (Math.abs(diff) > removable.length) {
        throw new HttpException(
          'Cantidad incorrecta, resuelve los préstamos del libro primero',
          HttpStatus.BAD_REQUEST
        );
      }
      // Prioriza dar de baja ejemplares disponibles antes que en mantenimiento.
      const ordered = [
        ...removable.filter((c: any) => c.status === CopyStatus.DISPONIBLE),
        ...removable.filter((c: any) => c.status !== CopyStatus.DISPONIBLE)
      ];
      for (let i = 0; i < Math.abs(diff); i += 1) {
        await tx.bookCopy.update({
          where: { id: ordered[i].id },
          data: { status: CopyStatus.BAJA }
        });
      }
    }

    return true;
  }

  async create(createPhysicalBookDto: any) {
    return this.prisma.$transaction(async (tx) => {
      const {
        authorId,
        authorName,
        authorIds = [],
        authorNames = [],
        categoryId,
        categoryName,
        categoryIds = [],
        categoryNames = [],
        copyCodes = [],
        totalStock,
        ...restOfDto
      } = createPhysicalBookDto;

      // 💡 Resolución de múltiples autores (copia de la lógica del módulo de libros digitales)
      const resolvedAuthorIds = await this.resolveAuthorIds(tx, [
        ...(authorId ? [authorId] : []),
        ...authorIds
      ], [
        ...(authorName ? [authorName] : []),
        ...authorNames
      ]);

      // 💡 Resolución de múltiples categorías / géneros
      const resolvedCategoryIds = await this.resolveCategoryIds(tx, [
        ...(categoryId ? [categoryId] : []),
        ...categoryIds
      ], [
        ...(categoryName ? [categoryName] : []),
        ...categoryNames
      ]);

      const parsedTotal = parseInt(totalStock) || 0;

      const physicalBook = await tx.physicalBook.create({
        data: {
          ...restOfDto,
          yearOfPublication: parseInt(restOfDto.yearOfPublication) || undefined,
          totalStock: 0,
          availableStock: 0,
          authors: {
            connect: resolvedAuthorIds.map(id => ({ id }))
          },
          categories: {
            connect: resolvedCategoryIds.map(id => ({ id }))
          }
        },
        include: {
          authors: { select: { id: true, name: true } },
          categories: { select: { id: true, name: true } }
        }
      });

      // 💡 Cada unidad del stock se materializa como un ejemplar individual
      await this.createCopies(tx, physicalBook, parsedTotal, Array.isArray(copyCodes) ? copyCodes : []);
      await recalcBookStock(tx, physicalBook.id);

      const withStock = await tx.physicalBook.findUnique({
        where: { id: physicalBook.id },
        include: {
          authors: { select: { id: true, name: true } },
          categories: { select: { id: true, name: true } },
          copies: { orderBy: { createdAt: 'asc' } }
        }
      });

      return {
        status: 'success',
        message: 'Libro físico creado exitosamente',
        data: { ...withStock }
      };
    });
  }

  async update(id: string, updatePhysicalBookDto: any) {
    return await this.prisma.$transaction(async (tx) => {
      const currentBook = await tx.physicalBook.findUnique({ where: { id } });
      if (!currentBook) throw new HttpException('Libro físico no encontrado', HttpStatus.NOT_FOUND);

      const {
        authorId,
        authorName,
        authorIds,
        authorNames,
        categoryId,
        categoryName,
        categoryIds,
        categoryNames,
        copyCodes,
        totalStock,
        ...restOfDto
      } = updatePhysicalBookDto;

      // 💡 Múltiples autores en actualización (set = desconecta los no incluidos)
      const resolvedAuthorIds = await this.resolveAuthorIds(tx, [
        ...(authorId ? [authorId] : []),
        ...(authorIds ?? [])
      ], [
        ...(authorName ? [authorName] : []),
        ...(authorNames ?? [])
      ]);

      // 💡 Múltiples categorías en actualización
      const resolvedCategoryIds = await this.resolveCategoryIds(tx, [
        ...(categoryId ? [categoryId] : []),
        ...(categoryIds ?? [])
      ], [
        ...(categoryName ? [categoryName] : []),
        ...(categoryNames ?? [])
      ]);

      const targetTotal = totalStock !== undefined ? parseInt(totalStock) : currentBook.totalStock;
      const hasCopies = await this.reconcileCopies(
        tx,
        currentBook,
        targetTotal,
        Array.isArray(copyCodes) ? copyCodes : []
      );

      const updateData: any = {
        ...restOfDto,
        yearOfPublication: restOfDto.yearOfPublication !== undefined
          ? parseInt(restOfDto.yearOfPublication)
          : currentBook.yearOfPublication,
      };

      if (!hasCopies) {
        // 💡 Modo legacy: libros sin ejemplares migrados conservan el cálculo previo
        const currentDifference = currentBook.totalStock - currentBook.availableStock;
        const parsedTotalStock = parseInt(totalStock) || currentBook.totalStock;
        const newAvailableStock = parsedTotalStock - currentDifference;
        if (newAvailableStock < 0) {
          throw new HttpException('Cantidad incorrecta, resuelve los préstamos del libro primero', HttpStatus.BAD_REQUEST);
        }
        updateData.totalStock = parsedTotalStock;
        updateData.availableStock = newAvailableStock;
      }

      if (authorIds !== undefined || authorId !== undefined || authorNames !== undefined || authorName !== undefined) {
        updateData.authors = {
          set: resolvedAuthorIds.map(id => ({ id }))
        };
      }

      if (categoryIds !== undefined || categoryId !== undefined || categoryNames !== undefined || categoryName !== undefined) {
        updateData.categories = {
          set: resolvedCategoryIds.map(id => ({ id }))
        };
      }

      let physicalBook = await tx.physicalBook.update({
        where: { id },
        data: updateData,
        include: {
          authors: { select: { id: true, name: true } },
          categories: { select: { id: true, name: true } }
        }
      });

      if (hasCopies) {
        await recalcBookStock(tx, id);
        physicalBook = await tx.physicalBook.findUnique({
          where: { id },
          include: {
            authors: { select: { id: true, name: true } },
            categories: { select: { id: true, name: true } }
          }
        });
      }

      return {
        status: 'success',
        message: 'Libro físico actualizado exitosamente',
        data: { ...physicalBook }
      };
    });
  }

  async findOne(id: string) {
    const physicalBook = await this.prisma.physicalBook.findUnique({
      where: { id },
      include: {
        authors: { select: { id: true, name: true } },
        categories: { select: { id: true, name: true } },
        copies: { orderBy: { createdAt: 'asc' } }
      }
    });

    if (!physicalBook) throw new HttpException('Libro físico no encontrado', HttpStatus.NOT_FOUND);

    return { status: 'success', data: physicalBook };
  }

  // 📦 Gestión de ejemplares individuales
  async addCopies(id: string, dto: any) {
    return this.prisma.$transaction(async (tx) => {
      const book = await tx.physicalBook.findUnique({ where: { id } });
      if (!book) throw new HttpException('Libro físico no encontrado', HttpStatus.NOT_FOUND);

      const requestedCodes: string[] = Array.isArray(dto.codes) ? dto.codes : [];
      const quantity = dto.quantity !== undefined ? parseInt(dto.quantity) : requestedCodes.length;
      if (!quantity || quantity <= 0) {
        throw new BadRequestException('Debes indicar al menos un ejemplar');
      }

      await this.createCopies(tx, book, quantity, requestedCodes, {
        location: dto.location,
        observations: dto.observations
      });

      const summary = await recalcBookStock(tx, id);
      const copies = await tx.bookCopy.findMany({
        where: { bookId: id },
        orderBy: { createdAt: 'asc' }
      });

      return { status: 'success', message: 'Ejemplares agregados', data: { copies, summary } };
    });
  }

  async findCopies(id: string) {
    const book = await this.prisma.physicalBook.findUnique({ where: { id } });
    if (!book) throw new HttpException('Libro físico no encontrado', HttpStatus.NOT_FOUND);

    const copies = await this.prisma.bookCopy.findMany({
      where: { bookId: id },
      orderBy: { createdAt: 'asc' }
    });

    return { status: 'success', data: copies };
  }

  async updateCopy(copyId: string, dto: any) {
    return this.prisma.$transaction(async (tx) => {
      const copy = await tx.bookCopy.findUnique({ where: { id: copyId } });
      if (!copy) throw new HttpException('Ejemplar no encontrado', HttpStatus.NOT_FOUND);

      const data: any = {};
      if (dto.code !== undefined && `${dto.code}`.trim()) data.code = `${dto.code}`.trim();
      if (dto.status !== undefined) data.status = dto.status;
      if (dto.location !== undefined) data.location = dto.location;
      if (dto.observations !== undefined) data.observations = dto.observations;

      let updated;
      try {
        updated = await tx.bookCopy.update({ where: { id: copyId }, data });
      } catch (error: any) {
        if (error?.code === 'P2002') {
          throw new HttpException('Ya existe un ejemplar con ese código', HttpStatus.CONFLICT);
        }
        throw error;
      }

      const summary = await recalcBookStock(tx, copy.bookId);
      return { status: 'success', message: 'Ejemplar actualizado', data: { copy: updated, summary } };
    });
  }

  async removeCopy(copyId: string) {
    return this.prisma.$transaction(async (tx) => {
      const copy = await tx.bookCopy.findUnique({ where: { id: copyId } });
      if (!copy) throw new HttpException('Ejemplar no encontrado', HttpStatus.NOT_FOUND);

      if (copy.status === CopyStatus.PRESTADO) {
        throw new BadRequestException('No puedes eliminar un ejemplar que está prestado');
      }

      await tx.bookCopy.delete({ where: { id: copyId } });
      const summary = await recalcBookStock(tx, copy.bookId);

      return { status: 'success', message: 'Ejemplar eliminado', data: { summary } };
    });
  }

  async findAll(query: any) {
    const take = parseInt(query.limit) || 10;
    const page = parseInt(query.page) || 1;
    const skip = (page - 1) * take;
    const search = query.search;
    const where: any = {};

    query.pnf = query.pnf == 'undefined' || query.pnf == '' ? 'todos' : query.pnf;
    query.genre = query.genre == 'undefined' ? '' : query.genre;

    if (search) {
      where.AND = [{ title: { contains: search, mode: 'insensitive' } }];
    }

    // 💡 Filtro por múltiples categorías: coincide si el libro tiene al menos una con ese nombre
    if (query.genre) {
      const genreFilter = {
        categories: {
          some: {
            name: {
              contains: query.genre,
              mode: 'insensitive'
            }
          }
        }
      };
      where.AND ? where.AND.push(genreFilter) : where.AND = [genreFilter];
    }

    // 💡 Filtro por múltiples autores: coincide si el libro tiene al menos uno con ese nombre
    if (query.authorName) {
      const authorFilter = {
        authors: {
          some: {
            name: { contains: query.authorName, mode: 'insensitive' }
          }
        }
      };
      where.AND ? where.AND.push(authorFilter) : where.AND = [authorFilter];
    }

    if (query.pnf != 'todos') {
      const pnfFilter = { pnf: query.pnf };
      where.AND ? where.AND.push(pnfFilter) : where.AND = [pnfFilter];
    }

    const totalPages = await this.prisma.physicalBook.count({ where });
    const data = await this.prisma.physicalBook.findMany({
      where, take, skip, include: {
        authors: { select: { id: true, name: true } },
        categories: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return { data, totalPages };
  }

  async remove(id: string) {
    await this.prisma.bookOperation.deleteMany({ where: { bookId: id } });
    await this.prisma.physicalBook.delete({ where: { id } });
    return { status: 'success', message: 'Libro físico eliminado' };
  }
}
