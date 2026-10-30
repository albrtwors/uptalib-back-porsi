import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateItemTypeDto } from './dto/create-item-type.dto';
import { UpdateItemTypeDto } from './dto/update-item-type.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ItemTypeService {
  constructor(private prisma: PrismaService) {}

  async create(createItemTypeDto: CreateItemTypeDto) {
    const name = createItemTypeDto.name.trim();
    const existing = await this.prisma.itemType.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });

    if (existing) {
      return {
        message: 'El tipo ya existe',
        status: 'success',
        data: existing,
      };
    }

    return {
      message: 'Tipo Creado',
      status: 'success',
      data: await this.prisma.itemType.create({ data: { name } }),
    };
  }

  async findAll(query: any) {
    const where: any = {};
    const take = parseInt(query.limit) || 10;

    if (query.search) {
      where.OR = [{ name: { contains: query.search, mode: 'insensitive' } }];
    }

    return this.prisma.itemType.findMany({
      where,
      take,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const itemType = await this.prisma.itemType.findUnique({ where: { id } });
    if (!itemType) {
      throw new HttpException('Tipo no encontrado', HttpStatus.NOT_FOUND);
    }

    return { status: 'success', data: itemType };
  }

  async update(id: string, updateItemTypeDto: UpdateItemTypeDto) {
    const data = updateItemTypeDto.name
      ? { name: updateItemTypeDto.name.trim() }
      : {};

    return {
      message: 'Tipo Actualizado',
      status: 'success',
      data: await this.prisma.itemType.update({ where: { id }, data }),
    };
  }

  async remove(id: string) {
    const itemType = await this.prisma.itemType.findUnique({ where: { id } });
    if (!itemType) {
      throw new HttpException('Tipo no encontrado', HttpStatus.NOT_FOUND);
    }

    return {
      message: 'Tipo Eliminado',
      status: 'success',
      data: await this.prisma.itemType.delete({ where: { id } }),
    };
  }
}
