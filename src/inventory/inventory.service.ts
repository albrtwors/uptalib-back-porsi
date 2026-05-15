import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';
import { CreateItemInventory } from './dto/create-item-dto';
import { EditItemInventory } from './dto/edit-item-dto';
import { getPagination } from '../functions/pagination/getPagination';

import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventory } from './dto/update-inventory.dto';


@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) { }
  async create(createInventoryDto: CreateInventoryDto) {

    return { item: await this.prisma.item.create({ data: { typeId: createInventoryDto.typeId, name: createInventoryDto.name, description: createInventoryDto.description, code: createInventoryDto.code, availableStock: createInventoryDto.stock, totalStock: createInventoryDto.stock, status: 'DISPONIBLE' } }), message: 'Item añadido' };
  }

  async findAll(query: any) {

    const search = query.search
    const where: any = {}

    //pagination stuff
    const { take, page, skip } = getPagination(query)


    if (search) {
      where.AND = [
        {
          name: { contains: search },
        },

      ]
    }

    if (query.type) {
      if (!where.AND) where.AND = [{ type: { name: { contains: query.type } } }]
      else where.AND.push({ type: { name: { contains: query.type } } })
    }

    const totalPages = Math.ceil(await this.prisma.item.count({ where }) / take)
    const data = await this.prisma.item.findMany({
      where, skip, take, include: {
        type: true
      }
    })
    return { data, totalPages }
  }

  findOne(id: string) {
    return `This action returns a #${id} inventorsyss`;
  }

  async edit(id: string, updateInventoryDto: UpdateInventory) {


    return { item: await this.prisma.item.update({ where: { id }, data: { typeId: updateInventoryDto.typeId, name: updateInventoryDto.name, description: updateInventoryDto.description, code: updateInventoryDto.code, availableStock: updateInventoryDto.stock, totalStock: updateInventoryDto.stock, status: 'DISPONIBLE' } }), message: 'Item actualizado' };
  }

  async delete(id: string) {

    await this.prisma.itemOperation.deleteMany({ where: { itemId: id } })

    return { item: await this.prisma.item.delete({ where: { id } }), message: 'Item Eliminado' }
  }
}
