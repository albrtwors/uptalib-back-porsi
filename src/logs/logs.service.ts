import { Injectable } from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { getPagination } from '../functions/pagination/getPagination';

import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class LogsService {
  constructor(private prisma: PrismaService) { }
  create(createLogDto: CreateLogDto) {
    return 'This action adds a new log';
  }

  async findAll(query: any) {
    const search = query.search
    const where: any = {}
    const { take, page, skip } = getPagination(query)
    if (search) {
      where.OR = [{ action: { contains: search } }]
    }
    const data = await this.prisma.operation.findMany({ where, take, skip, orderBy: { createdAt: 'desc' }, include: { user: true } })
    const totalPages = await this.prisma.operation.count({ where })

    return { data, totalPages };
  }

  findOne(id: number) {
    return `This action returns a #${id} log`;
  }

  update(id: number, updateLogDto: UpdateLogDto) {
    return `This action updates a #${id} log`;
  }

  remove(id: number) {
    return `This action removes a #${id} log`;
  }
}
