import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) { }
  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.prisma.category.create({ data: { name: createCategoryDto.name } })
    return { status: 'success', message: 'Categoria creada', data: category };
  }

  findAll(query: any) {
    const take = parseInt(query.limit) || 4;
    const search = query.search

    const where: any = {}

    if (search) {
      where.OR = [
        {
          name: { contains: search, mode: 'insensitive' },
        },

      ]
    }

    return this.prisma.category.findMany({
      take,
      where,
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.update({
      where: { id: id.toString() }, data: {
        name: updateCategoryDto.name
      }
    })
    return { status: 'success', message: `Se ha actualizado a ${updateCategoryDto.name}` };
  }

  async remove(id: string) {
    const category = await this.prisma.category.delete({
      where: { id: id.toString() }
    })
    return { status: 'success', message: 'Se ha eliminado la categoria' };
  }
}
