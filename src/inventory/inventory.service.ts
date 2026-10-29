import { BadRequestException, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CopyStatus } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { getPagination } from '../functions/pagination/getPagination';
import getStockDifference from '../utils/getDifference';
import { createItemCopies, recalcItemStock } from '../utils/copies';

@Injectable()
export class InventoryService {
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

  private async resolveTypeId(tx: any, typeId?: string, typeName?: string): Promise<string | undefined> {
    let resolvedTypeId = typeId;
    if (!resolvedTypeId && typeName && typeName.trim() !== '') {
      const cleanedTypeName = typeName.trim();
      let itemType = await tx.itemType.findFirst({
        where: { name: { equals: cleanedTypeName, mode: 'insensitive' } }
      });
      if (!itemType) {
        itemType = await tx.itemType.create({ data: { name: cleanedTypeName } });
      }
      resolvedTypeId = itemType.id;
    }
    return resolvedTypeId;
  }

  private async createCopies(
    tx: any,
    item: { id: string; code?: string | null },
    quantity: number,
    requestedCodes: string[] = [],
    extra: { location?: string | null; observations?: string | null; codeFrom?: string | null; codeTo?: string | null } = {}
  ) {
    return createItemCopies(tx, item, quantity, requestedCodes, extra);
  }

  private async reconcileCopies(
    tx: any,
    item: { id: string; code?: string | null },
    targetTotal: number,
    requestedCodes: string[] = []
  ): Promise<boolean> {
    const copies = await tx.itemCopy.findMany({
      where: { itemId: item.id },
      orderBy: { createdAt: 'asc' }
    });

    if (copies.length === 0) return false;

    const active = copies.filter((c: any) => c.status !== CopyStatus.BAJA);
    const diff = targetTotal - active.length;

    if (diff > 0) {
      await this.createCopies(tx, item, diff, requestedCodes);
    } else if (diff < 0) {
      const removable = active.filter((c: any) => c.status !== CopyStatus.PRESTADO);
      if (Math.abs(diff) > removable.length) {
        throw new HttpException(
          'Hay préstamos pendientes que impiden que reduzcas tanto el stock',
          HttpStatus.BAD_REQUEST
        );
      }
      const ordered = [
        ...removable.filter((c: any) => c.status === CopyStatus.DISPONIBLE),
        ...removable.filter((c: any) => c.status !== CopyStatus.DISPONIBLE)
      ];
      for (let i = 0; i < Math.abs(diff); i += 1) {
        await tx.itemCopy.update({
          where: { id: ordered[i].id },
          data: { status: CopyStatus.BAJA }
        });
      }
    }

    return true;
  }

  async create(createInventoryDto: any) {
    return this.prisma.$transaction(async (tx) => {
      const {
        typeId,
        typeName,
        stock,
        authorId,
        authorName,
        authorIds = [],
        authorNames = [],
        categoryId,
        categoryName,
        categoryIds = [],
        categoryNames = [],
        copyCodes = [],
        ...restOfDto
      } = createInventoryDto;

      const resolvedTypeId = await this.resolveTypeId(tx, typeId, typeName);

      // 💡 Resolución de múltiples autores (copia de la lógica del módulo de libros digitales)
      const resolvedAuthorIds = await this.resolveAuthorIds(tx, [
        ...(authorId ? [authorId] : []),
        ...authorIds
      ], [
        ...(authorName ? [authorName] : []),
        ...authorNames
      ]);

      // 💡 Resolución de múltiples categorías
      const resolvedCategoryIds = await this.resolveCategoryIds(tx, [
        ...(categoryId ? [categoryId] : []),
        ...categoryIds
      ], [
        ...(categoryName ? [categoryName] : []),
        ...categoryNames
      ]);

      const parsedStock = parseInt(stock) || 0;

      const item = await tx.item.create({
        data: {
          ...restOfDto,
          typeId: resolvedTypeId || undefined,
          availableStock: 0,
          totalStock: 0,
          status: 'DISPONIBLE',
          authors: {
            connect: resolvedAuthorIds.map(id => ({ id }))
          },
          categories: {
            connect: resolvedCategoryIds.map(id => ({ id }))
          }
        },
        include: {
          type: true,
          authors: { select: { id: true, name: true } },
          categories: { select: { id: true, name: true } }
        }
      });

      // 💡 Cada unidad del stock se materializa como un ejemplar individual
      await this.createCopies(tx, item, parsedStock, Array.isArray(copyCodes) ? copyCodes : []);
      await recalcItemStock(tx, item.id);

      const withStock = await tx.item.findUnique({
        where: { id: item.id },
        include: {
          type: true,
          authors: { select: { id: true, name: true } },
          categories: { select: { id: true, name: true } },
          copies: { orderBy: { createdAt: 'asc' } }
        }
      });

      return { item: withStock, message: 'Item añadido exitosamente' };
    });
  }

  async findAll(query: any) {
    const search = query.search;
    const where: any = {};

    // Pagination utility
    const { take, page, skip } = getPagination(query);

    // Búsqueda por coincidencia de nombre (Case-Insensitive)
    if (search) {
      where.AND = [
        {
          name: { contains: search, mode: 'insensitive' },
        },
      ];
    }

    // 💡 Ajustado el filtro de tipos de item para que sea Case Insensitive también
    if (query.type) {
      const typeFilter = {
        type: {
          name: { contains: query.type, mode: 'insensitive' }
        }
      };
      if (!where.AND) where.AND = [typeFilter];
      else where.AND.push(typeFilter);
    }

    // 💡 Filtro por categorías: coincide si el ítem tiene al menos una con ese nombre
    if (query.categoryName) {
      const categoryFilter = {
        categories: {
          some: {
            name: { contains: query.categoryName, mode: 'insensitive' }
          }
        }
      };
      if (!where.AND) where.AND = [categoryFilter];
      else where.AND.push(categoryFilter);
    }

    // 💡 Filtro por autores: coincide si el ítem tiene al menos uno con ese nombre
    if (query.authorName) {
      const authorFilter = {
        authors: {
          some: {
            name: { contains: query.authorName, mode: 'insensitive' }
          }
        }
      };
      if (!where.AND) where.AND = [authorFilter];
      else where.AND.push(authorFilter);
    }

    const totalPages = Math.ceil(await this.prisma.item.count({ where }) / take);
    const data = await this.prisma.item.findMany({
      where,
      skip,
      take,
      include: {
        type: true,
        authors: { select: { id: true, name: true } },
        categories: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return { data, totalPages };
  }

  async findOne(id: string) {
    const item = await this.prisma.item.findUnique({
      where: { id },
      include: {
        type: true,
        authors: { select: { id: true, name: true } },
        categories: { select: { id: true, name: true } },
        copies: { orderBy: { createdAt: 'asc' } }
      }
    });

    if (!item) throw new HttpException('Item no encontrado', HttpStatus.NOT_FOUND);

    return { status: 'success', data: item };
  }

  async edit(id: string, updateInventoryDto: any) {
    return this.prisma.$transaction(async (tx) => {
      const existingItem = await tx.item.findUnique({ where: { id } });
      if (!existingItem) throw new HttpException('Item no encontrado', HttpStatus.NOT_FOUND);

      const {
        typeId,
        typeName,
        stock,
        authorId,
        authorName,
        authorIds,
        authorNames,
        categoryId,
        categoryName,
        categoryIds,
        categoryNames,
        copyCodes,
        ...restOfDto
      } = updateInventoryDto;

      const resolvedTypeId = await this.resolveTypeId(tx, typeId, typeName);

      // 💡 Resolución de múltiples autores al editar
      const resolvedAuthorIds = await this.resolveAuthorIds(tx, [
        ...(authorId ? [authorId] : []),
        ...(authorIds ?? [])
      ], [
        ...(authorName ? [authorName] : []),
        ...(authorNames ?? [])
      ]);

      // 💡 Resolución de múltiples categorías al editar
      const resolvedCategoryIds = await this.resolveCategoryIds(tx, [
        ...(categoryId ? [categoryId] : []),
        ...(categoryIds ?? [])
      ], [
        ...(categoryName ? [categoryName] : []),
        ...(categoryNames ?? [])
      ]);

      const targetTotal = stock !== undefined ? parseInt(stock) : existingItem.totalStock;
      const hasCopies = await this.reconcileCopies(
        tx,
        existingItem,
        targetTotal,
        Array.isArray(copyCodes) ? copyCodes : []
      );

      const updateData: any = {
        ...restOfDto,
        typeId: resolvedTypeId || undefined,
      };

      if (!hasCopies) {
        // 💡 Modo legacy: items sin ejemplares migrados conservan el cálculo previo
        const parsedStock = parseInt(stock) || existingItem.totalStock;
        const newValue = getStockDifference({
          oldAvailableStockValue: existingItem.availableStock,
          oldCurrentStockValue: existingItem.totalStock,
          newStockValue: parsedStock
        });
        if (newValue < 0) {
          throw new HttpException("Hay préstamos pendientes que impiden que reduzcas tanto el stock", HttpStatus.BAD_REQUEST);
        }
        updateData.availableStock = parsedStock;
        updateData.totalStock = newValue;
        updateData.status = 'DISPONIBLE';
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

      let item = await tx.item.update({
        where: { id },
        data: updateData,
        include: {
          type: true,
          authors: { select: { id: true, name: true } },
          categories: { select: { id: true, name: true } }
        }
      });

      if (hasCopies) {
        await recalcItemStock(tx, id);
        item = await tx.item.findUnique({
          where: { id },
          include: {
            type: true,
            authors: { select: { id: true, name: true } },
            categories: { select: { id: true, name: true } }
          }
        });
      }

      return { item, message: 'Item actualizado con éxito' };
    });
  }

  async delete(id: string) {
    // Eliminación de cascada manual en transacciones controladas
    await this.prisma.itemOperation.deleteMany({ where: { itemId: id } });
    const item = await this.prisma.item.delete({ where: { id } });
    return { item, message: 'Item Eliminado correctamente' };
  }

  // 📦 Gestión de ejemplares individuales
  async addCopies(id: string, dto: any) {
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.item.findUnique({ where: { id } });
      if (!item) throw new HttpException('Item no encontrado', HttpStatus.NOT_FOUND);

      const requestedCodes: string[] = Array.isArray(dto.codes) ? dto.codes : [];
      const quantity = dto.quantity !== undefined ? parseInt(dto.quantity) : requestedCodes.length;
      if (!quantity || quantity <= 0) {
        throw new BadRequestException('Debes indicar al menos un ejemplar');
      }

      await this.createCopies(tx, item, quantity, requestedCodes, {
        location: dto.location,
        observations: dto.observations,
        codeFrom: dto.codeFrom,
        codeTo: dto.codeTo
      });

      const summary = await recalcItemStock(tx, id);
      const copies = await tx.itemCopy.findMany({
        where: { itemId: id },
        orderBy: { createdAt: 'asc' }
      });

      return { status: 'success', message: 'Ejemplares agregados', data: { copies, summary } };
    });
  }

  async findCopies(id: string) {
    const item = await this.prisma.item.findUnique({ where: { id } });
    if (!item) throw new HttpException('Item no encontrado', HttpStatus.NOT_FOUND);

    const copies = await this.prisma.itemCopy.findMany({
      where: { itemId: id },
      orderBy: { createdAt: 'asc' }
    });

    return { status: 'success', data: copies };
  }

  async updateCopy(copyId: string, dto: any) {
    return this.prisma.$transaction(async (tx) => {
      const copy = await tx.itemCopy.findUnique({ where: { id: copyId } });
      if (!copy) throw new HttpException('Ejemplar no encontrado', HttpStatus.NOT_FOUND);

      const data: any = {};
      if (dto.code !== undefined && `${dto.code}`.trim()) data.code = `${dto.code}`.trim();
      if (dto.status !== undefined) data.status = dto.status;
      if (dto.location !== undefined) data.location = dto.location;
      if (dto.observations !== undefined) data.observations = dto.observations;

      let updated;
      try {
        updated = await tx.itemCopy.update({ where: { id: copyId }, data });
      } catch (error: any) {
        if (error?.code === 'P2002') {
          throw new HttpException('Ya existe un ejemplar con ese código', HttpStatus.CONFLICT);
        }
        throw error;
      }

      const summary = await recalcItemStock(tx, copy.itemId);
      return { status: 'success', message: 'Ejemplar actualizado', data: { copy: updated, summary } };
    });
  }

  async removeCopy(copyId: string) {
    return this.prisma.$transaction(async (tx) => {
      const copy = await tx.itemCopy.findUnique({ where: { id: copyId } });
      if (!copy) throw new HttpException('Ejemplar no encontrado', HttpStatus.NOT_FOUND);

      if (copy.status === CopyStatus.PRESTADO) {
        throw new BadRequestException('No puedes eliminar un ejemplar que está prestado');
      }

      await tx.itemCopy.delete({ where: { id: copyId } });
      const summary = await recalcItemStock(tx, copy.itemId);

      return { status: 'success', message: 'Ejemplar eliminado', data: { summary } };
    });
  }
}
