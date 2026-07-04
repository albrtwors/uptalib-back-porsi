import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePhysicalBookDto } from './dto/create-physical-book.dto';
import { UpdatePhysicalBookDto } from './dto/update-physical-book.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PhysicalBooksService {
  constructor(private prisma: PrismaService) { }

  async create(createPhysicalBookDto: any) {
    return this.prisma.$transaction(async (tx) => {
      const { authorId, categoryId, authorName, categoryName, ...restOfDto } = createPhysicalBookDto;

      let resolvedAuthorId = authorId;
      let resolvedCategoryId = categoryId;

      // 👤 Resolución manual de Autor
      if (!resolvedAuthorId && authorName && authorName.trim() !== '') {
        const cleanedName = authorName.trim();
        let author = await tx.author.findFirst({
          where: { name: { equals: cleanedName, mode: 'insensitive' } }
        });

        if (!author) {
          author = await tx.author.create({
            data: { name: cleanedName }
          });
        }
        resolvedAuthorId = author.id;
      }

      // 📂 Resolución manual de Categoría / Género
      if (!resolvedCategoryId && categoryName && categoryName.trim() !== '') {
        const cleanedCategory = categoryName.trim();
        let category = await tx.category.findFirst({
          where: { name: { equals: cleanedCategory, mode: 'insensitive' } }
        });

        if (!category) {
          category = await tx.category.create({
            data: { name: cleanedCategory }
          });
        }
        resolvedCategoryId = category.id;
      }

      // Guardar el libro físico usando las IDs resueltas directamente
      const physicalBook = await tx.physicalBook.create({
        data: {
          ...restOfDto,
          yearOfPublication: parseInt(restOfDto.yearOfPublication) || undefined,
          totalStock: parseInt(restOfDto.totalStock) || 0,
          availableStock: parseInt(restOfDto.totalStock) || 0,
          authorId: resolvedAuthorId || undefined,
          categoryId: resolvedCategoryId || undefined
        }
      });

      return {
        status: 'success',
        message: 'Libro físico creado exitosamente',
        data: { ...physicalBook }
      };
    });
  }

  async update(id: string, updatePhysicalBookDto: any) {
    return await this.prisma.$transaction(async (tx) => {
      const currentBook = await tx.physicalBook.findUnique({ where: { id } });
      if (!currentBook) throw new HttpException('Libro físico no encontrado', HttpStatus.NOT_FOUND);

      const { authorId, categoryId, authorName, categoryName, ...restOfDto } = updatePhysicalBookDto;

      let resolvedAuthorId = authorId;
      let resolvedCategoryId = categoryId;

      // 👤 Resolución manual de Autor en actualización
      if (!resolvedAuthorId && authorName && authorName.trim() !== '') {
        const cleanedName = authorName.trim();
        let author = await tx.author.findFirst({
          where: { name: { equals: cleanedName, mode: 'insensitive' } }
        });

        if (!author) {
          author = await tx.author.create({
            data: { name: cleanedName }
          });
        }
        resolvedAuthorId = author.id;
      }

      // 📂 Resolución manual de Categoría en actualización
      if (!resolvedCategoryId && categoryName && categoryName.trim() !== '') {
        const cleanedCategory = categoryName.trim();
        let category = await tx.category.findFirst({
          where: { name: { equals: cleanedCategory, mode: 'insensitive' } }
        });

        if (!category) {
          category = await tx.category.create({
            data: { name: cleanedCategory }
          });
        }
        resolvedCategoryId = category.id;
      }

      const currentDifference = currentBook.totalStock - currentBook.availableStock;
      const parsedTotalStock = parseInt(restOfDto.totalStock) || currentBook.totalStock;
      const newAvailableStock = parsedTotalStock - currentDifference;

      if (newAvailableStock < 0) {
        throw new HttpException('Cantidad incorrecta, resuelve los préstamos del libro primero', HttpStatus.BAD_REQUEST);
      }

      const physicalBook = await tx.physicalBook.update({
        where: { id },
        data: {
          ...restOfDto,
          yearOfPublication: parseInt(restOfDto.yearOfPublication) || undefined,
          totalStock: parsedTotalStock,
          availableStock: newAvailableStock,
          authorId: resolvedAuthorId || undefined,
          categoryId: resolvedCategoryId || undefined
        }
      });

      return {
        status: 'success',
        message: 'Libro físico actualizado exitosamente',
        data: { ...physicalBook }
      };
    });
  }

  async findAll(query: any) {
    const take = parseInt(query.limit) || 10;
    const page = parseInt(query.page) || 1;
    const skip = (page - 1) * take;
    const search = query.search;
    const where: any = {};

    query.pnf = query.pnf == 'undefined' || query.pnf == '' ? 'todos' : query.pnf;
    query.genre = query.genre == 'undefined' ? '' : query.genre;

    if (search) {
      where.AND = [{ title: { contains: search, mode: 'insensitive' } }];
    }

    // 💡 Aquí aplicamos mode: 'insensitive' al filtro por relación de categoría
    if (query.genre) {
      const genreFilter = {
        category: {
          name: {
            contains: query.genre,
            mode: 'insensitive' // 👈 Evita problemas si viene en mayúsculas o minúsculas
          }
        }
      };
      where.AND ? where.AND.push(genreFilter) : where.AND = [genreFilter];
    }

    if (query.pnf != 'todos') {
      const pnfFilter = { pnf: query.pnf };
      where.AND ? where.AND.push(pnfFilter) : where.AND = [pnfFilter];
    }

    const totalPages = await this.prisma.physicalBook.count({ where });
    const data = await this.prisma.physicalBook.findMany({
      where, take, skip, include: {
        author: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } }
      },
    });
    return { data, totalPages };
  }

  async remove(id: string) {
    await this.prisma.bookOperation.deleteMany({ where: { bookId: id } });
    await this.prisma.physicalBook.delete({ where: { id } });
    return { status: 'success', message: 'Libro físico eliminado' };
  }
}