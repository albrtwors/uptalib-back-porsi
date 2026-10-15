import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CopyStatus } from '@prisma/client';
import { CreateInventoryOperationDto } from './dto/create-inventory-operation.dto';
import { UpdateInventoryOperationDto } from './dto/update-inventory-operation.dto';
import { PrismaService } from 'prisma/prisma.service';
import { LoanDto } from './dto/loan-dto';
import { EntrieDto } from './dto/entrie-dto';
import { DropDto } from './dto/drop-dto';
import { createItemCopies, recalcItemStock } from '../utils/copies';

@Injectable()
export class InventoryOperationService {
  constructor(private prisma: PrismaService) { }
  create(createInventoryOperationDto: CreateInventoryOperationDto) {
    return 'This action adds a new inventoryOperation';
  }

  async addDrops(entriesDto: DropDto) {
    return this.prisma.$transaction(async (tx) => {
      const existingItem = await tx.item.findUnique({ where: { id: entriesDto.itemId } });
      if (!existingItem) throw new HttpException('Item no encontrado', HttpStatus.NOT_FOUND);

      const copies = await tx.itemCopy.findMany({
        where: { itemId: entriesDto.itemId },
        orderBy: { createdAt: 'asc' }
      });

      if (copies.length > 0) {
        const removable = copies.filter((c: any) => c.status !== CopyStatus.PRESTADO);
        if (removable.length < entriesDto.quantity) {
          throw new BadRequestException('Hay prestamos pendientes, las bajas no pueden tener un valor superior a la cantidad de stock disponible');
        }

        const ordered = [
          ...removable.filter((c: any) => c.status === CopyStatus.DISPONIBLE),
          ...removable.filter((c: any) => c.status !== CopyStatus.DISPONIBLE)
        ];

        for (let i = 0; i < entriesDto.quantity; i += 1) {
          await tx.itemCopy.update({ where: { id: ordered[i].id }, data: { status: CopyStatus.BAJA } });
        }

        await recalcItemStock(tx, entriesDto.itemId);
      } else {
        const difference = existingItem.totalStock - existingItem.availableStock;
        const newValue = existingItem.totalStock - entriesDto.quantity - difference;
        if (newValue < 0) throw new BadRequestException('Hay prestamos pendientes, las bajas no pueden tener un valor superior a la cantidad de stock disponible');

        await tx.item.update({
          where: { id: entriesDto.itemId }, data: {
            availableStock: { decrement: entriesDto.quantity },
            totalStock: { decrement: entriesDto.quantity }
          }
        });
      }

      await tx.itemOperation.create({
        data: {
          itemId: entriesDto.itemId,
          quantity: entriesDto.quantity,
          type: 'BAJA',
          personNames: entriesDto.personNames,
          personSurNames: entriesDto.personSurNames
        }
      });

      return { status: 'success', message: 'Bajas añadidas' };
    });
  }

  async addEntries(entriesDto: EntrieDto) {
    return this.prisma.$transaction(async (tx) => {
      const existingItem = await tx.item.findUnique({ where: { id: entriesDto.itemId } });
      if (!existingItem) throw new HttpException('Item no encontrado', HttpStatus.NOT_FOUND);

      // 🎯 Cada entrada materializa nuevos ejemplares individuales
      await createItemCopies(tx, existingItem, entriesDto.quantity, Array.isArray(entriesDto.codes) ? entriesDto.codes : []);
      await recalcItemStock(tx, entriesDto.itemId);

      await tx.itemOperation.create({
        data: {
          itemId: entriesDto.itemId,
          quantity: entriesDto.quantity,
          type: 'ENTRADA',
          personNames: entriesDto.personNames,
          personSurNames: entriesDto.personSurNames
        }
      });

      return { status: 'success', message: 'Entradas añadidas' };
    });
  }


  async loan(itemLoan: LoanDto) {
    return this.prisma.$transaction(async (tx) => {
      const copyIds: string[] = Array.isArray(itemLoan.copyIds) ? itemLoan.copyIds : [];

      if (copyIds.length > 0) {
        const copies = await tx.itemCopy.findMany({ where: { id: { in: copyIds } } });
        if (copies.length !== copyIds.length) {
          throw new HttpException('Uno o más ejemplares no existen', HttpStatus.NOT_FOUND);
        }

        const itemId = itemLoan.itemId || copies[0].itemId;
        const loans = [];

        for (const copy of copies) {
          if (copy.itemId !== itemId) throw new BadRequestException('El ejemplar no pertenece al artículo indicado');
          if (copy.status !== CopyStatus.DISPONIBLE) throw new BadRequestException(`El ejemplar ${copy.code} no está disponible`);

          const loan = await tx.itemOperation.create({
            data: {
              itemId,
              copyId: copy.id,
              quantity: 1,
              personId: itemLoan.personId,
              personNames: itemLoan.personNames,
              personSurNames: itemLoan.personSurNames,
              type: 'PRESTAMO'
            }
          });

          await tx.itemCopy.update({ where: { id: copy.id }, data: { status: CopyStatus.PRESTADO } });
          loans.push(loan);
        }

        await recalcItemStock(tx, itemId);
        return { status: 'success', message: 'Prestamo Registrado', loan: loans[0], loans };
      }

      const quantity = itemLoan.quantity ?? 1;

      const available = await tx.itemCopy.findMany({
        where: { itemId: itemLoan.itemId, status: CopyStatus.DISPONIBLE },
        orderBy: { createdAt: 'asc' }
      });

      if (available.length > 0) {
        if (available.length < quantity) throw new BadRequestException('No hay suficientes items para hacer el prestamo');

        const loans = [];
        for (let i = 0; i < quantity; i += 1) {
          const copy = available[i];
          const loan = await tx.itemOperation.create({
            data: {
              itemId: itemLoan.itemId,
              copyId: copy.id,
              quantity: 1,
              personId: itemLoan.personId,
              personNames: itemLoan.personNames,
              personSurNames: itemLoan.personSurNames,
              type: 'PRESTAMO'
            }
          });
          await tx.itemCopy.update({ where: { id: copy.id }, data: { status: CopyStatus.PRESTADO } });
          loans.push(loan);
        }

        await recalcItemStock(tx, itemLoan.itemId);
        return { status: 'success', message: 'Prestamo Registrado', loan: loans[0], loans };
      }

      // 💡 Modo legacy para items sin ejemplares migrados
      const existingItem = await tx.item.findUnique({ where: { id: itemLoan.itemId } });
      if (!existingItem) throw new HttpException('Item no encontrado', HttpStatus.NOT_FOUND);
      if (existingItem.availableStock - quantity < 0) throw new BadRequestException('No hay suficientes items para hacer el prestamo');

      const loan = await tx.itemOperation.create({
        data: {
          type: 'PRESTAMO',
          quantity,
          itemId: itemLoan.itemId,
          personId: itemLoan.personId,
          personNames: itemLoan.personNames,
          personSurNames: itemLoan.personSurNames
        }
      });

      await tx.item.update({
        where: { id: itemLoan.itemId }, data: {
          availableStock: { decrement: quantity }
        }
      });

      return { status: 'success', message: 'Prestamo Registrado', loan };
    });
  }

  async settle(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const existingLoan = await tx.itemOperation.findUnique({ where: { id } });
      if (!existingLoan) throw new HttpException('Préstamo no encontrado', HttpStatus.NOT_FOUND);

      await tx.itemOperation.create({
        data: {
          type: 'DEVOLUCION',
          quantity: existingLoan.quantity,
          itemId: existingLoan.itemId,
          copyId: existingLoan.copyId,
          personId: existingLoan.personId,
          personNames: existingLoan.personNames,
          personSurNames: existingLoan.personSurNames
        }
      });

      await tx.itemOperation.update({
        where: { id }, data: { wasSettled: true }
      });

      if (existingLoan.copyId) {
        await tx.itemCopy.update({ where: { id: existingLoan.copyId }, data: { status: CopyStatus.DISPONIBLE } });
        await recalcItemStock(tx, existingLoan.itemId);
      } else {
        await tx.item.update({
          where: { id: existingLoan.itemId }, data: {
            availableStock: { increment: existingLoan.quantity }
          }
        });
      }

      return { status: 'success', message: 'Item Devuelto' };
    });
  }

  async findAllLoans(query: any) {
    const where: any = {}
    //pagination
    const limit = parseInt(query.limit) || 10
    const page = parseInt(query.page) || 1
    const skip = (page - 1) * limit

    if (query.search) {
      where.OR = [
        { item: { name: { contains: query.search } } }
      ]
    }

    const data = await this.prisma.itemOperation.findMany({
      where: { ...where, type: 'PRESTAMO', wasSettled: false },
      include: {
        item: true,
        copy: { select: { code: true } }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    })
    const totalPages = Math.ceil(await this.prisma.itemOperation.count({ where: { ...where, type: 'PRESTAMO', wasSettled: false } }) / limit)
    return { data, totalPages }
  }

  async findAll(query: any) {
    const where: any = {}

    //pagination stuff
    const page = parseInt(query.page) || 1
    const take = parseInt(query.limit) || 10
    const skip = (page - 1) * take



    if (query.search) {
      where.AND = [
        { item: { name: { contains: query.search } } }
      ]
    }
    const totalPages = await this.prisma.itemOperation.count({
      where
    })
    const data = await this.prisma.itemOperation.findMany({
      where, take, skip, orderBy: { createdAt: 'desc' }, include: {
        item: true,
        copy: { select: { code: true } }
      }
    })


    return { data, totalPages }
  }

  findOne(id: number) {
    return `This action returns a #${id} inventoryOperation`;
  }

  update(id: number, updateInventoryOperationDto: UpdateInventoryOperationDto) {
    return `This action updates a #${id} inventoryOperation`;
  }

  remove(id: number) {
    return `This action removes a #${id} inventoryOperation`;
  }
}
