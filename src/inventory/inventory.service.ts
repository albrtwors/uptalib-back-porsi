import { BadRequestException, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { getPagination } from '../functions/pagination/getPagination';
import getStockDifference from '../utils/getDifference';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) { }

  async create(createInventoryDto: any) {
    return this.prisma.$transaction(async (tx) => {
      const { typeId, typeName, stock, ...restOfDto } = createInventoryDto;

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

      const parsedStock = parseInt(stock) || 0;

      const item = await tx.item.create({
        data: {
          ...restOfDto,
          typeId: resolvedTypeId || undefined,
          availableStock: parsedStock,
          totalStock: parsedStock,
          status: 'DISPONIBLE'
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

    const totalPages = Math.ceil(await this.prisma.item.count({ where }) / take);
    const data = await this.prisma.item.findMany({
      where,
      skip,
      take,
      include: {
        type: true
      }
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

      const { typeId, typeName, stock, ...restOfDto } = updateInventoryDto;

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

      const parsedStock = parseInt(stock) || existingItem.totalStock;

      const newValue = getStockDifference({
        oldAvailableStockValue: existingItem.availableStock,
        oldCurrentStockValue: existingItem.totalStock,
        newStockValue: parsedStock
      });

      if (newValue < 0) {
        throw new HttpException("Hay préstamos pendientes que impiden que reduzcas tanto el stock", HttpStatus.BAD_REQUEST);
      }

      const item = await tx.item.update({
        where: { id },
        data: {
          ...restOfDto,
          typeId: resolvedTypeId || undefined,
          availableStock: parsedStock,
          totalStock: newValue,
          status: 'DISPONIBLE'
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