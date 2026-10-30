import {
  BadRequestException,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CopyStatus } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { getPagination } from '../functions/pagination/getPagination';
import getStockDifference from '../utils/getDifference';
import {
  createItemCopies,
  recalcItemStock,
  type CopyExtra,
} from '../utils/copies';
import { bulkErrorMessage, bulkSummaryMessage } from '../utils/bulk';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  private async resolveTypeIds(
    tx: any,
    ids: string[] = [],
    names: string[] = [],
  ): Promise<string[]> {
    const resolved: string[] = [];

    for (const id of ids) {
      if (id && !resolved.includes(id)) resolved.push(id);
    }

    for (const name of names) {
      const cleaned = `${name}`.trim();
      if (!cleaned) continue;

      let itemType = await tx.itemType.findFirst({
        where: { name: { equals: cleaned, mode: 'insensitive' } },
      });

      if (!itemType) {
        itemType = await tx.itemType.create({ data: { name: cleaned } });
      }

      if (!resolved.includes(itemType.id)) resolved.push(itemType.id);
    }

    return resolved;
  }

  private async createCopies(
    tx: any,
    item: { id: string; code?: string | null },
    quantity: number,
    requestedCodes: string[] = [],
    extra: CopyExtra = {},
  ) {
    return createItemCopies(tx, item, quantity, requestedCodes, extra);
  }

  private async reconcileCopies(
    tx: any,
    item: { id: string; code?: string | null },
    targetTotal: number,
    requestedCodes: string[] = [],
    extra: CopyExtra = {},
  ): Promise<boolean> {
    const copies = await tx.itemCopy.findMany({
      where: { itemId: item.id },
      orderBy: { createdAt: 'asc' },
    });

    if (copies.length === 0) return false;

    const active = copies.filter((c: any) => c.status !== CopyStatus.BAJA);
    const diff = targetTotal - active.length;

    if (diff > 0) {
      await this.createCopies(tx, item, diff, requestedCodes, extra);
    } else if (diff < 0) {
      const removable = active.filter(
        (c: any) => c.status !== CopyStatus.PRESTADO,
      );
      if (Math.abs(diff) > removable.length) {
        throw new HttpException(
          'Hay préstamos pendientes que impiden que reduzcas tanto el stock',
          HttpStatus.BAD_REQUEST,
        );
      }
      const ordered = [
        ...removable.filter((c: any) => c.status === CopyStatus.DISPONIBLE),
        ...removable.filter((c: any) => c.status !== CopyStatus.DISPONIBLE),
      ];
      for (let i = 0; i < Math.abs(diff); i += 1) {
        await tx.itemCopy.update({
          where: { id: ordered[i].id },
          data: { status: CopyStatus.BAJA },
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
        typeIds = [],
        typeNames = [],
        stock,
        copyCodes = [],
        codeFrom,
        codeTo,
        ...restOfDto
      } = createInventoryDto;

      const resolvedTypeIds = await this.resolveTypeIds(
        tx,
        [...(typeId ? [typeId] : []), ...typeIds],
        [...(typeName ? [typeName] : []), ...typeNames],
      );

      if (resolvedTypeIds.length === 0) {
        throw new BadRequestException('Debes seleccionar al menos un tipo');
      }

      const parsedStock = parseInt(stock) || 0;

      const item = await tx.item.create({
        data: {
          ...restOfDto,
          availableStock: 0,
          totalStock: 0,
          status: 'DISPONIBLE',
          types: {
            connect: resolvedTypeIds.map((id) => ({ id })),
          },
        },
        include: {
          types: { select: { id: true, name: true } },
        },
      });

      // 💡 Cada unidad del stock se materializa como un ejemplar individual
      await this.createCopies(
        tx,
        item,
        parsedStock,
        Array.isArray(copyCodes) ? copyCodes : [],
        { codeFrom, codeTo },
      );
      await recalcItemStock(tx, item.id);

      const withStock = await tx.item.findUnique({
        where: { id: item.id },
        include: {
          types: { select: { id: true, name: true } },
          copies: { orderBy: { createdAt: 'asc' } },
        },
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

    // 💡 Coincide si el ítem tiene al menos un tipo con ese nombre
    if (query.type) {
      const typeFilter = {
        types: {
          some: {
            name: { contains: query.type, mode: 'insensitive' },
          },
        },
      };
      if (!where.AND) where.AND = [typeFilter];
      else where.AND.push(typeFilter);
    }

    const totalPages = Math.ceil(
      (await this.prisma.item.count({ where })) / take,
    );
    const data = await this.prisma.item.findMany({
      where,
      skip,
      take,
      include: {
        types: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { data, totalPages };
  }

  async findOne(id: string) {
    const item = await this.prisma.item.findUnique({
      where: { id },
      include: {
        types: { select: { id: true, name: true } },
        copies: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!item)
      throw new HttpException('Item no encontrado', HttpStatus.NOT_FOUND);

    return { status: 'success', data: item };
  }

  async edit(id: string, updateInventoryDto: any) {
    return this.prisma.$transaction(async (tx) => {
      const existingItem = await tx.item.findUnique({ where: { id } });
      if (!existingItem)
        throw new HttpException('Item no encontrado', HttpStatus.NOT_FOUND);

      const {
        typeId,
        typeName,
        typeIds,
        typeNames,
        stock,
        copyCodes,
        codeFrom,
        codeTo,
        ...restOfDto
      } = updateInventoryDto;

      const typesProvided =
        typeId !== undefined ||
        typeName !== undefined ||
        typeIds !== undefined ||
        typeNames !== undefined;

      const resolvedTypeIds = typesProvided
        ? await this.resolveTypeIds(
            tx,
            [...(typeId ? [typeId] : []), ...(typeIds ?? [])],
            [...(typeName ? [typeName] : []), ...(typeNames ?? [])],
          )
        : [];

      if (typesProvided && resolvedTypeIds.length === 0) {
        throw new BadRequestException('Debes seleccionar al menos un tipo');
      }

      const targetTotal =
        stock !== undefined ? parseInt(stock) : existingItem.totalStock;
      const hasCopies = await this.reconcileCopies(
        tx,
        {
          ...existingItem,
          // 💡 Los nuevos ejemplares usan el código objetivo del artículo, no el antiguo
          code:
            restOfDto.code !== undefined
              ? `${restOfDto.code ?? ''}`.trim() || existingItem.code
              : existingItem.code,
        },
        targetTotal,
        Array.isArray(copyCodes) ? copyCodes : [],
        { codeFrom, codeTo },
      );

      const updateData: any = {
        ...restOfDto,
      };

      if (!hasCopies) {
        // 💡 Modo legacy: items sin ejemplares migrados conservan el cálculo previo
        const parsedStock = parseInt(stock) || existingItem.totalStock;
        const newValue = getStockDifference({
          oldAvailableStockValue: existingItem.availableStock,
          oldCurrentStockValue: existingItem.totalStock,
          newStockValue: parsedStock,
        });
        if (newValue < 0) {
          throw new HttpException(
            'Hay préstamos pendientes que impiden que reduzcas tanto el stock',
            HttpStatus.BAD_REQUEST,
          );
        }
        updateData.availableStock = parsedStock;
        updateData.totalStock = newValue;
        updateData.status = 'DISPONIBLE';
      }

      if (typesProvided) {
        updateData.types = {
          set: resolvedTypeIds.map((id) => ({ id })),
        };
      }

      let item = await tx.item.update({
        where: { id },
        data: updateData,
        include: {
          types: { select: { id: true, name: true } },
        },
      });

      if (hasCopies) {
        await recalcItemStock(tx, id);
        item = await tx.item.findUnique({
          where: { id },
          include: {
            types: { select: { id: true, name: true } },
          },
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

  /**
   * Crea o actualiza varios artículos en un mismo request. Cada registro se
   * procesa por separado para que un error no descarte los demás.
   */
  async bulkUpsert(records: any[]) {
    const created: any[] = [];
    const updated: any[] = [];
    const errors: { index: number; name: string; message: string }[] = [];

    for (let index = 0; index < records.length; index++) {
      const record = records[index] ?? {};
      const { id, ...data } = record;
      const name = `${record.name ?? ''}`.trim() || `Registro ${index + 1}`;
      const hasTypes =
        [record.typeId, record.typeName].some((value) => `${value ?? ''}`.trim()) ||
        (Array.isArray(record.typeIds) && record.typeIds.length > 0) ||
        (Array.isArray(record.typeNames) && record.typeNames.length > 0);

      const missing: string[] = [];
      if (!id && !`${data.name ?? ''}`.trim()) missing.push('name');
      if (!id && [undefined, null, ''].includes(data.stock)) missing.push('stock');
      if (!id && !hasTypes) missing.push('typeIds/typeNames');

      if (missing.length > 0) {
        errors.push({
          index,
          name,
          message: `Faltan campos obligatorios: ${missing.join(', ')}`,
        });
        continue;
      }

      try {
        const result: any = id ? await this.edit(id, data) : await this.create(data);
        (id ? updated : created).push(result?.item ?? result);
      } catch (error: any) {
        errors.push({ index, name, message: bulkErrorMessage(error) });
      }
    }

    return {
      status: 'success',
      message: bulkSummaryMessage({
        created: created.length,
        updated: updated.length,
        failed: errors.length,
      }),
      data: { created, updated, errors },
    };
  }

  async removeMany(ids: string[]) {
    const deleted = await this.prisma.$transaction(async (tx) => {
      await tx.itemOperation.deleteMany({ where: { itemId: { in: ids } } });
      // 💡 ItemCopy tiene onDelete: Cascade, los ejemplares se eliminan con el artículo
      return (await tx.item.deleteMany({ where: { id: { in: ids } } })).count;
    });

    return {
      status: 'success',
      message: bulkSummaryMessage({ deleted, failed: ids.length - deleted }),
      data: { deleted },
    };
  }

  // 📦 Gestión de ejemplares individuales
  async addCopies(id: string, dto: any) {
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.item.findUnique({ where: { id } });
      if (!item)
        throw new HttpException('Item no encontrado', HttpStatus.NOT_FOUND);

      const requestedCodes: string[] = Array.isArray(dto.codes)
        ? dto.codes
        : [];
      const quantity =
        dto.quantity !== undefined
          ? parseInt(dto.quantity)
          : requestedCodes.length;
      if (!quantity || quantity <= 0) {
        throw new BadRequestException('Debes indicar al menos un ejemplar');
      }

      await this.createCopies(tx, item, quantity, requestedCodes, {
        location: dto.location,
        observations: dto.observations,
        codeFrom: dto.codeFrom,
        codeTo: dto.codeTo,
      });

      const summary = await recalcItemStock(tx, id);
      const copies = await tx.itemCopy.findMany({
        where: { itemId: id },
        orderBy: { createdAt: 'asc' },
      });

      return {
        status: 'success',
        message: 'Ejemplares agregados',
        data: { copies, summary },
      };
    });
  }

  async findCopies(id: string) {
    const item = await this.prisma.item.findUnique({ where: { id } });
    if (!item)
      throw new HttpException('Item no encontrado', HttpStatus.NOT_FOUND);

    const copies = await this.prisma.itemCopy.findMany({
      where: { itemId: id },
      orderBy: { createdAt: 'asc' },
    });

    return { status: 'success', data: copies };
  }

  async updateCopy(copyId: string, dto: any) {
    return this.prisma.$transaction(async (tx) => {
      const copy = await tx.itemCopy.findUnique({ where: { id: copyId } });
      if (!copy)
        throw new HttpException('Ejemplar no encontrado', HttpStatus.NOT_FOUND);

      const data: any = {};
      if (dto.code !== undefined && `${dto.code}`.trim())
        data.code = `${dto.code}`.trim();
      if (dto.status !== undefined) data.status = dto.status;
      if (dto.location !== undefined) data.location = dto.location;
      if (dto.observations !== undefined) data.observations = dto.observations;

      let updated;
      try {
        updated = await tx.itemCopy.update({ where: { id: copyId }, data });
      } catch (error: any) {
        if (error?.code === 'P2002') {
          throw new HttpException(
            'Ya existe un ejemplar con ese código',
            HttpStatus.CONFLICT,
          );
        }
        throw error;
      }

      const summary = await recalcItemStock(tx, copy.itemId);
      return {
        status: 'success',
        message: 'Ejemplar actualizado',
        data: { copy: updated, summary },
      };
    });
  }

  async removeCopy(copyId: string) {
    return this.prisma.$transaction(async (tx) => {
      const copy = await tx.itemCopy.findUnique({ where: { id: copyId } });
      if (!copy)
        throw new HttpException('Ejemplar no encontrado', HttpStatus.NOT_FOUND);

      if (copy.status === CopyStatus.PRESTADO) {
        throw new BadRequestException(
          'No puedes eliminar un ejemplar que está prestado',
        );
      }

      await tx.itemCopy.delete({ where: { id: copyId } });
      const summary = await recalcItemStock(tx, copy.itemId);

      return {
        status: 'success',
        message: 'Ejemplar eliminado',
        data: { summary },
      };
    });
  }
}
