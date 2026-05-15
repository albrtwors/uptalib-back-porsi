import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePhysicalBookDto } from './dto/create-physical-book.dto';
import { UpdatePhysicalBookDto } from './dto/update-physical-book.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PhysicalBooksService {
  constructor(private prisma: PrismaService) { }
  async create(createPhysicalBookDto: CreatePhysicalBookDto) {
    return this.prisma.$transaction(async (tx) => {

      const physicalBook = await tx.physicalBook.create({
        data: { ...createPhysicalBookDto, availableStock: createPhysicalBookDto.totalStock }
      })

      return {
        status: 'success',
        message: 'Libro físico creados exitosamente',
        data: { ...physicalBook }
      };
    });
  }

  async findAll(query: any) {

    const take = parseInt(query.limit) || 10;
    const page = parseInt(query.page) || 1
    const skip = (page - 1) * take

    const search = query.search
    const where: any = {}

    query.pnf = query.pnf == 'undefined' || query.pnf == '' ? 'todos' : query.pnf
    query.genre = query.genre == 'undefined' ? '' : query.genre

    if (search) {
      where.AND = [
        {
          title: { contains: search },
        },

      ]
    }

    if (query.genre) {
      if (where.AND) {
        where.AND.push({
          category: {
            name: { contains: query.genre || '' }
          }
        })
      } else {
        where.AND = [
          {
            category: { name: query.genre || '' },
          },

        ]
      }

    }



    if (query.pnf != 'todos') {


      if (where.AND) {
        where.AND.push({
          pnf: query.pnf
        })
      } else if (!where.AND) {
        where.AND = [
          { pnf: query.pnf }
        ]
      }
    }




    const totalPages = await this.prisma.physicalBook.count({ where })
    const data = await this.prisma.physicalBook.findMany({
      where, take, skip, include: {
        author: {
          select: {
            id: true,
            name: true
          }
        },
        category: {
          select: {
            id: true,
            name: true
          }
        }
      },
    })
    return { data, totalPages }
  }

  findOne(id: number) {
    return `This action returns a #${id} physicalBook`;
  }

  async update(id: string, updatePhysicalBookDto: UpdatePhysicalBookDto) {
    return await this.prisma.$transaction(async (tx) => {
      // 1. Obtener el PhysicalBook actual para calcular la diferencia
      const currentBook = await tx.physicalBook.findUnique({
        where: { id }
      });

      if (!currentBook) {
        throw new Error('Libro físico no encontrado');
      }

      // 2. Calcular la diferencia actual (prestados, dañados, etc.)
      const currentDifference = currentBook.totalStock - currentBook.availableStock;

      // 3. Calcular el nuevo availableStock manteniendo la diferencia
      const newAvailableStock = updatePhysicalBookDto.totalStock - currentDifference;
      if (newAvailableStock < 0) {
        throw new HttpException('Cantidad incorrecta, resuelve los prestamos del libro primero', HttpStatus.BAD_REQUEST)
      }

      // 4. Actualizar con los valores calculados
      const physicalBook = await tx.physicalBook.update({
        where: { id },
        data: {
          ...updatePhysicalBookDto,
          availableStock: newAvailableStock // ✅ Automático
        }
      });

      return {
        status: 'success',
        message: 'Libro físico actualizado exitosamente',
        data: {
          ...physicalBook,
          difference: currentDifference // Para debugging
        }
      };
    });
  }

  async remove(id: string) {

    await this.prisma.bookOperation.deleteMany({
      where: {
        bookId: id
      }
    });

    const removedBook = await this.prisma.physicalBook.delete({
      where: { id }
    })
    return { status: 'success', message: 'Libro fisico eliminado' };
  }
}
