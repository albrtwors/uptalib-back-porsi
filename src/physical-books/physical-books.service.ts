import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

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

      const physicalBook = await tx.physicalBook.create({
        data: {
          ...restOfDto,
          yearOfPublication: parseInt(restOfDto.yearOfPublication) || undefined,
          totalStock: parseInt(restOfDto.totalStock) || 0,
          availableStock: parseInt(restOfDto.totalStock) || 0,
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

      return {
        status: 'success',
        message: 'Libro físico creado exitosamente',
        data: { ...physicalBook }
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

      const currentDifference = currentBook.totalStock - currentBook.availableStock;
      const parsedTotalStock = parseInt(restOfDto.totalStock) || currentBook.totalStock;
      const newAvailableStock = parsedTotalStock - currentDifference;

      if (newAvailableStock < 0) {
        throw new HttpException('Cantidad incorrecta, resuelve los préstamos del libro primero', HttpStatus.BAD_REQUEST);
      }

      const updateData: any = {
        ...restOfDto,
        yearOfPublication: parseInt(restOfDto.yearOfPublication) || undefined,
        totalStock: parsedTotalStock,
        availableStock: newAvailableStock
      };

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

      const physicalBook = await tx.physicalBook.update({
        where: { id },
        data: updateData,
        include: {
          authors: { select: { id: true, name: true } },
          categories: { select: { id: true, name: true } }
        }
      });

      return {
        status: 'success',
        message: 'Libro físico actualizado exitosamente',
        data: { ...physicalBook }
      };
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