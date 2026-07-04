import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface BookCreateInput {
  title: string;
  description?: string;
  routepdf: string;
  routeimg?: string;
  pnfs?: string[];
  authorIds?: string[];
}

interface BookUpdateInput {
  title?: string;
  description?: string;
  routepdf?: string;
  routeimg?: string;
  pnfs?: string[];
  authorIds?: string[];
}

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) { }

  async findOne(id: number) {
    return await this.prisma.book.findUnique({
      where: { id },
      include: {
        pnfs: true,
        authors: true
      }
    });
  }

  async findAll(query: any) {
    const take = parseInt(query.limit) || 10;
    const page = parseInt(query.page) || 1;
    const skip = (page - 1) * take;

    const search = query.search;
    const pnf = query.pnf;
    const authorsParam = query.authors;

    // 💡 Creamos un arreglo de condiciones explícitas para el AND
    const andConditions: any[] = [];

    // 1️⃣ Filtro por PNF estricto (Aseguramos mayúsculas por si el enum es estricto en la BD)
    if (pnf && pnf.trim() !== "") {
      andConditions.push({
        pnfs: {
          some: {
            pnf: pnf.trim().toUpperCase() // 👈 Limpieza y estandarización a mayúsculas
          }
        }
      });
    }

    // 2️⃣ Filtro por múltiples IDs de Autores
    if (authorsParam && authorsParam.trim() !== "") {
      const authorIdsArray = authorsParam.split(',').map((id: string) => id.trim()).filter(Boolean);
      if (authorIdsArray.length > 0) {
        andConditions.push({
          authors: {
            some: {
              id: {
                in: authorIdsArray
              }
            }
          }
        });
      }
    }

    // 3️⃣ Filtro por término de búsqueda (Título / Descripción / Nombre de Autor)
    if (search && search.trim() !== "") {
      andConditions.push({
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          {
            authors: {
              some: {
                name: { contains: search, mode: 'insensitive' }
              }
            }
          }
        ]
      });
    }

    // 💡 Si hay condiciones acumuladas, las asignamos al WHERE usando AND explícito
    const where = andConditions.length > 0 ? { AND: andConditions } : {};

    // Calcular total de elementos para la paginación correcta
    const totalCount = await this.prisma.book.count({ where });
    const totalPages = Math.ceil(totalCount / take);

    const data = await this.prisma.book.findMany({
      take,
      skip,
      where,
      include: {
        pnfs: true,
        authors: true
      },
      orderBy: { id: 'desc' }
    });

    return { data, totalPages };
  }

  async create(data: BookCreateInput, req: any) {
    const { title, description, routepdf, routeimg, pnfs = [], authorIds = [] } = data;

    const book = await this.prisma.book.create({
      data: {
        title,
        description,
        routepdf,
        routeimg,
        authors: {
          connect: authorIds.map(id => ({ id }))
        },
        pnfs: {
          create: pnfs.map(pnfItem => ({ pnf: pnfItem as any }))
        }
      }
    });

    await this.prisma.operation.create({
      data: {
        userId: req.user.userId,
        ip: req.ip,
        action: `creó el libro Digital ${title}`
      }
    });

    return { message: 'Libro Creado', book };
  }

  async delete(id: number, req: any) {
    const book = await this.prisma.book.findFirst({ where: { id } });
    if (!book) throw new NotFoundException('El libro no existe');

    await this.prisma.bookPnf.deleteMany({ where: { bookId: id } });
    await this.prisma.savedBook.deleteMany({ where: { bookId: id } });

    await this.prisma.operation.create({
      data: {
        userId: req.user.userId,
        ip: req.ip,
        action: `Eliminó el libro Digital ${book.title}`
      }
    });

    return {
      book: await this.prisma.book.delete({ where: { id } }),
      message: 'Libro Eliminado'
    };
  }

  async edit(id: number, data: BookUpdateInput, req: any) {
    const book = await this.prisma.book.findFirst({ where: { id } });
    if (!book) throw new NotFoundException('El libro no existe');

    const { title, description, routepdf, routeimg, pnfs, authorIds } = data;

    const updateData: any = {
      title,
      description,
      routepdf,
      routeimg
    };

    if (authorIds) {
      updateData.authors = {
        set: authorIds.map(authId => ({ id: authId }))
      };
    }

    if (pnfs) {
      await this.prisma.bookPnf.deleteMany({ where: { bookId: id } });
      updateData.pnfs = {
        create: pnfs.map(pnfItem => ({ pnf: pnfItem as any }))
      };
    }

    await this.prisma.operation.create({
      data: {
        userId: req.user.userId,
        ip: req.ip,
        action: `Editó el libro Digital ${title || book.title}`
      }
    });

    return {
      book: await this.prisma.book.update({
        where: { id },
        data: updateData,
        include: { pnfs: true, authors: true }
      }),
      message: 'Libro editado'
    };
  }

  async saveToUser(userId: number, bookId: number) {
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) throw new NotFoundException('El libro no existe');

    try {
      return {
        message: "Libro Guardado",
        data: await this.prisma.savedBook.create({
          data: { userId, bookId },
        })
      };
    } catch (error) {
      throw new ConflictException('Ya tienes este libro guardado');
    }
  }

  async removeFromUser(userId: number, bookId: number) {
    const savedBook = await this.prisma.savedBook.findMany({
      where: { userId, bookId }
    });

    if (savedBook.length === 0) throw new NotFoundException('El libro no estaba guardado por este usuario');

    await this.prisma.savedBook.delete({
      where: { id: savedBook[0].id, userId }
    });

    return { message: 'Libro eliminado', data: savedBook };
  }

  async getVerifyLike(userId: any, bookId: any) {
    const savedBook = await this.prisma.savedBook.findMany({
      where: { userId, bookId }
    });
    return savedBook[0] ? true : false;
  }

  async getSavedBooks(userId: number, query: any) {
    const where: any = { userId };
    const page = parseInt(query.page) || 1;
    const take = parseInt(query.limit) || 10;
    const skip = (page - 1) * take;

    if (query.search) {
      where.OR = [
        { book: { title: { contains: query.search, mode: 'insensitive' } } }
      ];
    }

    const totalCount = await this.prisma.savedBook.count({ where });
    const totalPages = Math.ceil(totalCount / take);

    const data = await this.prisma.savedBook.findMany({
      where,
      take,
      skip,
      include: {
        book: {
          include: { pnfs: true, authors: true }
        }
      },
    });

    return { data, totalPages };
  }
}