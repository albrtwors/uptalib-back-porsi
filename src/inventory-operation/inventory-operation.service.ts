import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateInventoryOperationDto } from './dto/create-inventory-operation.dto';
import { UpdateInventoryOperationDto } from './dto/update-inventory-operation.dto';
import { PrismaService } from 'prisma/prisma.service';
import { LoanDto } from './dto/loan-dto';
import { EntrieDto } from './dto/entrie-dto';
import { DropDto } from './dto/drop-dto';
import getStockDifference from '../utils/getDifference';

@Injectable()
export class InventoryOperationService {
  constructor(private prisma: PrismaService) { }
  create(createInventoryOperationDto: CreateInventoryOperationDto) {
    return 'This action adds a new inventoryOperation';
  }

  async addDrops(entriesDto: DropDto) {

    const existingItem = await this.prisma.item.findUnique({ where: { id: entriesDto.itemId } })

    const newValue = getStockDifference({ newStockValue: existingItem.totalStock - entriesDto.quantity, oldCurrentStockValue: existingItem.totalStock, oldAvailableStockValue: existingItem.availableStock })
    if (newValue < 0) throw new BadRequestException('Hay prestamos pendientes, las bajas no pueden tener un valor superior a la cantidad de stock disponible')

    const book = await this.prisma.item.update({

      where: { id: entriesDto.itemId }, data: {
        availableStock: {
          decrement: entriesDto.quantity
        },
        totalStock: {
          decrement: entriesDto.quantity
        }
      }
    })

    await this.prisma.itemOperation.create({
      data: {
        itemId: entriesDto.itemId,
        quantity: entriesDto.quantity,
        type: 'BAJA',
        personNames: entriesDto.personNames,
        personSurNames: entriesDto.personSurNames

      }
    })

    return { status: 'success', message: 'Bajas añadidas' }
  }

  async addEntries(entriesDto: EntrieDto) {
    const existingItem = await this.prisma.item.findUnique({ where: { id: entriesDto.itemId } })

    const book = await this.prisma.item.update({
      where: { id: entriesDto.itemId }, data: {
        availableStock: {
          increment: entriesDto.quantity
        },
        totalStock: {
          increment: entriesDto.quantity
        }
      }
    })

    await this.prisma.itemOperation.create({
      data: {
        itemId: entriesDto.itemId,
        quantity: entriesDto.quantity,
        type: 'ENTRADA',
        personNames: entriesDto.personNames,
        personSurNames: entriesDto.personSurNames

      }
    })

    return { status: 'success', message: 'Entradas añadidas' }
  }


  async loan(itemLoan: LoanDto) {

    const existingItem = await this.prisma.item.findUnique({ where: { id: itemLoan.itemId } })

    if (existingItem.availableStock - itemLoan.quantity < 0) throw new BadRequestException('No hay suficientes items para hacer el prestamo')

    const loan = await this.prisma.itemOperation.create({
      data: {
        type: 'PRESTAMO',
        quantity: itemLoan.quantity,
        itemId: itemLoan.itemId,
        personId: itemLoan.personId,
        personNames: itemLoan.personNames,
        personSurNames: itemLoan.personSurNames,
      }
    })


    await this.prisma.item.update({
      where: { id: itemLoan.itemId }, data: {
        availableStock: { decrement: itemLoan.quantity }
      }
    })

    return { status: 'success', message: 'Prestamo Registrado' }
  }

  async settle(id: string) {

    const existingLoan = await this.prisma.itemOperation.findUnique({ where: { id } })

    const loan = await this.prisma.itemOperation.create({
      data: {
        type: 'DEVOLUCION',
        quantity: existingLoan.quantity,
        itemId: existingLoan.itemId,
        personId: existingLoan.personId,
        personNames: existingLoan.personNames,
        personSurNames: existingLoan.personSurNames,
      }
    })

    await this.prisma.itemOperation.update({
      where: { id }, data: {
        wasSettled: true
      }
    })


    await this.prisma.item.update({
      where: { id: loan.itemId }, data: {
        availableStock: { increment: existingLoan.quantity }
      }
    })

    return { status: 'success', message: 'Item Devuelto' }
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
      where: { ...where, type: 'PRESTAMO', wasSettled: false }, include: { item: true }, skip, take: limit
    })
    const totalPages = Math.ceil(await this.prisma.itemOperation.count({ where: { ...where, type: 'PRESTAMO', wasSettled: false }, orderBy: { createdAt: 'desc' } }) / limit)
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
        item: true
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
