import { Injectable } from '@nestjs/common';
import { CreateItemTypeDto } from './dto/create-item-type.dto';
import { UpdateItemTypeDto } from './dto/update-item-type.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ItemTypeService {
  constructor(private prisma: PrismaService) { }

  async create(createItemTypeDto: CreateItemTypeDto) {
    return { message: 'Tipo Creado', status: 'success', data: await this.prisma.itemType.create({ data: createItemTypeDto }) }

  }

  async findAll(query: any) {
    const where: any = {}
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } }
      ]
    }
    return await this.prisma.itemType.findMany({ where, take: 10 });
  }

  findOne(id: string) {
    return `This action returns a #${id} itemType`;
  }

  async update(id: string, updateItemTypeDto: UpdateItemTypeDto) {
    return { message: 'Tipo Actualizado', status: 'success', data: await this.prisma.itemType.update({ where: { id }, data: updateItemTypeDto }) }
  }

  async remove(id: string) {
    return { message: 'Tipo Eliminado', status: 'success', data: await this.prisma.itemType.delete({ where: { id } }) }
  }
}
