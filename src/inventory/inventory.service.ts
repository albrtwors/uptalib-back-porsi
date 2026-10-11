import { BadRequestException, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { getPagination } from '../functions/pagination/getPagination';
import getStockDifference from '../utils/getDifference';

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
        ...restOfDto
      } = createInventoryDto;

      let resolvedTypeId = typeId;

      // 🛠️ Enfoque 2: Buscar primero o crear el Tipo de Item manualmente
      if (!resolvedTypeId && typeName && typeName.trim() !== '') {
        const cleanedTypeName = typeName.trim();
        let itemType = await tx.itemType.findFirst({
          where: { name: { equals: cleanedTypeName, mode: 'insensitive' } }
        });

        if (!itemType) {
          itemType = await tx.itemType.create({
            data: { name: cleanedTypeName }
          });
        }
        resolvedTypeId = itemType.id;
      }

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
          availableStock: parsedStock,
          totalStock: parsedStock,
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

      return { item, message: 'Item añadido exitosamente' };
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

  findOne(id: string) {
    return `This action returns a #${id} inventory item`;
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
        ...restOfDto
      } = updateInventoryDto;

      let resolvedTypeId = typeId;

      // 🛠️ Enfoque 2: Resolución de tipo en la edición
      if (!resolvedTypeId && typeName && typeName.trim() !== '') {
        const cleanedTypeName = typeName.trim();
        let itemType = await tx.itemType.findFirst({
          where: { name: { equals: cleanedTypeName, mode: 'insensitive' } }
        });

        if (!itemType) {
          itemType = await tx.itemType.create({
            data: { name: cleanedTypeName }
          });
        }
        resolvedTypeId = itemType.id;
      }

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

      const parsedStock = parseInt(stock) || existingItem.totalStock;

      const newValue = getStockDifference({
        oldAvailableStockValue: existingItem.availableStock,
        oldCurrentStockValue: existingItem.totalStock,
        newStockValue: parsedStock
      });

      if (newValue < 0) {
        throw new HttpException("Hay préstamos pendientes que impiden que reduzcas tanto el stock", HttpStatus.BAD_REQUEST);
      }

      const updateData: any = {
        ...restOfDto,
        typeId: resolvedTypeId || undefined,
        availableStock: parsedStock,
        totalStock: newValue,
        status: 'DISPONIBLE'
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

      const item = await tx.item.update({
        where: { id },
        data: updateData,
        include: {
          type: true,
          authors: { select: { id: true, name: true } },
          categories: { select: { id: true, name: true } }
        }
      });

      return { item, message: 'Item actualizado con éxito' };
    });
  }

  async delete(id: string) {
    // Eliminación de cascada manual en transacciones controladas
    await this.prisma.itemOperation.deleteMany({ where: { itemId: id } });
    const item = await this.prisma.item.delete({ where: { id } });
    return { item, message: 'Item Eliminado correctamente' };
  }
}