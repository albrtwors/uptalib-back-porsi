import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ensurePnf, normalizePnfName } from '../utils/pnf';
import { CreatePnfDto } from './dto/create-pnf.dto';
import { UpdatePnfDto } from './dto/update-pnf.dto';

@Injectable()
export class PnfService {
  constructor(private prisma: PrismaService) {}

  async create(createPnfDto: CreatePnfDto) {
    const pnf = await ensurePnf(this.prisma, createPnfDto.name);
    return { status: 'success', message: 'PNF listo', data: pnf };
  }

  async findAll(query: any = {}) {
    const take = parseInt(query.limit) || 100;
    const search = normalizePnfName(query.search);

    return this.prisma.pnf.findMany({
      where: search
        ? { name: { contains: search, mode: 'insensitive' } }
        : undefined,
      take,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const pnf = await this.prisma.pnf.findUnique({ where: { id } });
    if (!pnf) throw new NotFoundException('PNF no encontrado');
    return { status: 'success', data: pnf };
  }

  async update(id: string, updatePnfDto: UpdatePnfDto) {
    const current = await this.prisma.pnf.findUnique({ where: { id } });
    if (!current) throw new NotFoundException('PNF no encontrado');

    const name = normalizePnfName(updatePnfDto.name ?? current.name);
    if (!name) throw new ConflictException('El nombre del PNF no puede estar vacío');

    try {
      const data = await this.prisma.pnf.update({ where: { id }, data: { name } });
      return { status: 'success', message: 'PNF actualizado', data };
    } catch (error: any) {
      if (error?.code === 'P2002') throw new ConflictException('Ya existe un PNF con ese nombre');
      throw error;
    }
  }

  async remove(id: string) {
    const current = await this.prisma.pnf.findUnique({ where: { id } });
    if (!current) throw new NotFoundException('PNF no encontrado');

    await this.prisma.pnf.delete({ where: { id } });
    return { status: 'success', message: 'PNF eliminado', data: current };
  }
}
