import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface book {
  title: string; description?: string; routepdf: string; routeimg?: string
}
interface bookUpdate {
  title?: string; description?: string; routepdf?: string; routeimg?: string
}

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) { }


  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({ where: { id } })
    return book
  }

  async findAll(query: any) {
    const take = parseInt(query.limit) || 10;
    const page = parseInt(query.page) || 1
    const skip = (page - 1) * take

    const search = query.search
    const where: any = {}

    if (search) {
      where.OR = [
        {
          title: { contains: search },
        },
        {
          description: { contains: search }
        }
      ]
    }

    const totalPages = await this.prisma.book.count({ where })
    const data = await this.prisma.book.findMany({
      take,
      skip,
      where,
    })


    return { data, totalPages }


  }
  async create(data: any, req: any) {
    const book = await this.prisma.book.create({ data })

    await this.prisma.operation.create({ data: { userId: req.user.userId, ip: req.ip, action: `creó el libro Digital ${data.title}` } })
    return { message: 'Libro Creado' };
  }

  async delete(id: number, req: any) {
    const book = await this.prisma.book.findFirst({ where: { id } })
    await this.prisma.savedBook.deleteMany({ where: { bookId: id } })
    await this.prisma.operation.create({ data: { userId: req.user.userId, ip: req.ip, action: `Eliminó el libro Digital ${book.title}` } })
    return { book: await this.prisma.book.delete({ where: { id } }), message: 'Libro Eliminado' }
  }

  async edit(id: number, data: bookUpdate, req: any) {
    const book = await this.prisma.book.findFirst({ where: { id } })
    await this.prisma.operation.create({ data: { userId: req.user.userId, ip: req.ip, action: `Editó el libro Digital ${book.title}` } })
    return { book: await this.prisma.book.update({ where: { id }, data: data }), message: 'Libro editado' }
  }

  async saveToUser(userId: number, bookId: number) {
    // Verificamos si el libro existe
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) throw new NotFoundException('El libro no existe');

    try {
      return {
        message: "Libro Guardado", data: await this.prisma.savedBook.create({
          data: {
            userId,
            bookId,
          },
        })
      }
    } catch (error) {
      // P2002 es el código de Prisma para violación de restricción única
      throw new ConflictException('Ya tienes este libro guardado');
    }
  }
  async removeFromUser(userId: number, bookId: number) {
    const savedBook = await this.prisma.savedBook.findMany({
      where: {
        userId,
        bookId: bookId
      }
    })
    await this.prisma.savedBook.delete({
      where: { id: savedBook[0].id, userId }

    })

    return { message: 'Libro eliminado', data: savedBook }

  }

  async getVerifyLike(userId: any, bookId: any) {

    const savedBook = await this.prisma.savedBook.findMany({
      where: {
        userId,
        bookId
      }
    })

    return savedBook[0] ? true : false
  }

  async getSavedBooks(userId: number, query: any) {

    console.log(userId)
    const where: any = { userId }

    //pagination stuff
    const page = parseInt(query.page) || 1
    const take = parseInt(query.limit) || 10
    const skip = (page - 1) * 1


    if (query.search) {
      where.OR = [
        { book: { title: { contains: query.search } } }
      ]

    }

    const totalPages = await this.prisma.savedBook.count({ where })

    const data = await this.prisma.savedBook.findMany({
      where,
      take, skip,
      include: {
        book: true, // Asegúrate que en el schema diga 'book' y no 'books'
      },
    });

    return { data, totalPages };
  }
}