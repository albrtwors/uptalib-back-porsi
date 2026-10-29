import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CopyStatus, OperationType } from '@prisma/client';
import { CreatePhysicalBookOperationDto } from './dto/create-physical-book-operation.dto';
import { UpdatePhysicalBookOperationDto } from './dto/update-physical-book-operation.dto';
import { PrismaService } from 'prisma/prisma.service';
import { DropDto } from './dto/drop-dto';
import { EntrieDto } from './dto/entrie-dto';
import { LoanDto } from './dto/loan-dto';
import { createBookCopies, recalcBookStock } from '../utils/copies';
import { bulkSummaryMessage } from '../utils/bulk';

@Injectable()
export class PhysicalBookOperationService {
  constructor(private prisma: PrismaService) { }
  //operation global related
  async findAllOperations(query) {

    let QUERY: any = {
    }

    //pagination stuff
    const limit = parseInt(query.limit) || 10
    const page = parseInt(query.page) || 1
    const skip = (page - 1) * limit

    if (query.search) {
      QUERY.where = { OR: [{ book: { title: { contains: query.search, mode: 'insensitive' } } }] }
    } else {
      QUERY.where = {}
    }

    // 💡 Filtro por tipo de operación (llega vacío cuando no se selecciona ninguno)
    const operationType = `${query.type ?? ''}`.trim().toUpperCase()
    if (operationType && (OperationType as any)[operationType]) {
      QUERY.where.type = operationType
    }

    const totalPages = await this.prisma.bookOperation.count({
      where: QUERY.where
    })

    const data = await this.prisma.bookOperation.findMany({
      ...QUERY, take: limit, skip, orderBy: {
        createdAt: 'desc'
      }, include: {
        book: {
          select: {
            title: true,
            isbn: true,
            code: true
          }

        },
        copy: {
          select: {
            code: true
          }
        }
      }
    })

    return { totalPages, data }


  }

  async addDrops(entriesDto: DropDto) {
    return this.prisma.$transaction(async (tx) => {
      const existingBook = await tx.physicalBook.findUnique({ where: { id: entriesDto.bookId } });
      if (!existingBook) throw new HttpException('Libro físico no encontrado', HttpStatus.NOT_FOUND);

      const copies = await tx.bookCopy.findMany({
        where: { bookId: entriesDto.bookId },
        orderBy: { createdAt: 'asc' }
      });

      if (copies.length > 0) {
        // 🎯 Sólo se pueden dar de baja ejemplares que no estén prestados
        const removable = copies.filter((c: any) => c.status !== CopyStatus.PRESTADO);
        if (removable.length < entriesDto.quantity) {
          throw new BadRequestException('Hay prestamos pendientes, las bajas no pueden tener un valor superior a la cantidad de stock disponible');
        }

        const ordered = [
          ...removable.filter((c: any) => c.status === CopyStatus.DISPONIBLE),
          ...removable.filter((c: any) => c.status !== CopyStatus.DISPONIBLE)
        ];

        for (let i = 0; i < entriesDto.quantity; i += 1) {
          await tx.bookCopy.update({ where: { id: ordered[i].id }, data: { status: CopyStatus.BAJA } });
        }

        await recalcBookStock(tx, entriesDto.bookId);
      } else {
        // 💡 Modo legacy para libros sin ejemplares migrados
        const difference = existingBook.totalStock - existingBook.availableStock;
        const newValue = existingBook.totalStock - entriesDto.quantity - difference;
        if (newValue < 0) throw new BadRequestException('Hay prestamos pendientes, las bajas no pueden tener un valor superior a la cantidad de stock disponible');

        await tx.physicalBook.update({
          where: { id: entriesDto.bookId }, data: {
            availableStock: { decrement: entriesDto.quantity },
            totalStock: { decrement: entriesDto.quantity }
          }
        });
      }

      await tx.bookOperation.create({
        data: {
          bookId: entriesDto.bookId,
          quantity: entriesDto.quantity,
          type: 'BAJA',
          personNames: entriesDto.personNames,
          personSurNames: entriesDto.personSurNames
        }
      });

      return { status: 'success', message: 'Bajas añadidas' };
    });
  }

  async addEntries(entriesDto: EntrieDto) {
    return this.prisma.$transaction(async (tx) => {
      const book = await tx.physicalBook.findUnique({ where: { id: entriesDto.bookId } });
      if (!book) throw new HttpException('Libro físico no encontrado', HttpStatus.NOT_FOUND);

      // 🎯 Cada entrada materializa nuevos ejemplares individuales
      await createBookCopies(tx, book, entriesDto.quantity, Array.isArray(entriesDto.codes) ? entriesDto.codes : [], {
        codeFrom: entriesDto.codeFrom,
        codeTo: entriesDto.codeTo
      });
      await recalcBookStock(tx, entriesDto.bookId);

      await tx.bookOperation.create({
        data: {
          bookId: entriesDto.bookId,
          quantity: entriesDto.quantity,
          type: 'ENTRADA',
          personNames: entriesDto.personNames,
          personSurNames: entriesDto.personSurNames
        }
      });

      return { status: 'success', message: 'Entradas añadidas' };
    });
  }


  //loan related
  async findAllLoans(query) {
    const QUERY: any = {}


    //pagination stuff
    const page: any = query.page || 1
    const limit: any = query.limit || 10
    const skip: any = (page - 1) * limit


    if (query.search) {
      QUERY.where = { type: 'PRESTAMO', OR: [{ book: { title: { contains: query.search, mode: 'insensitive' } } }] }
    }

    QUERY.take = parseInt(limit)
    QUERY.skip = parseInt(skip)


    const data = await this.prisma.bookOperation.findMany({
      ...QUERY, where: { ...QUERY.where, wasSettled: false, type: 'PRESTAMO' }, orderBy: { createdAt: 'desc' }, include: {
        book: {
          select: {
            title: true,
            code: true
          }
        },
        copy: {
          select: {
            code: true
          }
        }
      }
    })
    const totalPages = await this.prisma.bookOperation.count({
      where: { ...QUERY.where, type: 'PRESTAMO', wasSettled: false }
    })
    return { data, totalPages }
  }

  async settle(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const existingLoan = await tx.bookOperation.findUnique({ where: { id } });
      if (!existingLoan) throw new HttpException('Préstamo no encontrado', HttpStatus.NOT_FOUND);

      await tx.bookOperation.create({
        data: {
          bookId: existingLoan.bookId,
          copyId: existingLoan.copyId,
          quantity: existingLoan.quantity,
          observations: existingLoan.observations,
          personId: existingLoan.personId,
          personNames: existingLoan.personNames,
          personSurNames: existingLoan.personSurNames,
          type: 'DEVOLUCION'
        }
      });

      await tx.bookOperation.update({
        where: { id }, data: { wasSettled: true }
      });

      if (existingLoan.copyId) {
        // 🎯 El ejemplar vuelve a estar disponible
        await tx.bookCopy.update({ where: { id: existingLoan.copyId }, data: { status: CopyStatus.DISPONIBLE } });
        await recalcBookStock(tx, existingLoan.bookId);
      } else {
        await tx.physicalBook.update({
          where: { id: existingLoan.bookId }, data: {
            availableStock: { increment: existingLoan.quantity }
          }
        });
      }

      return { state: 'success', message: 'El libro ha sido devuelto' };
    });
  }

  async loan(makeLoanDto: LoanDto) {
    return await this.prisma.$transaction(async (tx) => {
      const copyIds: string[] = Array.isArray(makeLoanDto.copyIds) ? makeLoanDto.copyIds : [];

      // 🎯 Préstamo por ejemplares específicos
      if (copyIds.length > 0) {
        const copies = await tx.bookCopy.findMany({ where: { id: { in: copyIds } } });
        if (copies.length !== copyIds.length) {
          throw new HttpException('Uno o más ejemplares no existen', HttpStatus.NOT_FOUND);
        }

        const bookId = makeLoanDto.bookId || copies[0].bookId;
        const loans = [];

        for (const copy of copies) {
          if (copy.bookId !== bookId) throw new BadRequestException('El ejemplar no pertenece al libro indicado');
          if (copy.status !== CopyStatus.DISPONIBLE) throw new BadRequestException(`El ejemplar ${copy.code} no está disponible`);

          const loan = await tx.bookOperation.create({
            data: {
              bookId,
              copyId: copy.id,
              quantity: 1,
              observations: makeLoanDto.observations,
              personId: makeLoanDto.personId,
              personNames: makeLoanDto.personNames,
              personSurNames: makeLoanDto.personSurNames,
              type: 'PRESTAMO'
            }
          });

          await tx.bookCopy.update({ where: { id: copy.id }, data: { status: CopyStatus.PRESTADO } });
          loans.push(loan);
        }

        await recalcBookStock(tx, bookId);
        return { state: 'success', message: 'Prestamo hecho', loan: loans[0], loans };
      }

      const quantity = makeLoanDto.quantity ?? 1;

      // 💡 Sin ejemplares explícitos: se toman automáticamente disponibles por orden
      const available = await tx.bookCopy.findMany({
        where: { bookId: makeLoanDto.bookId, status: CopyStatus.DISPONIBLE },
        orderBy: { createdAt: 'asc' }
      });

      if (available.length > 0) {
        if (available.length < quantity) throw new BadRequestException('La cantidad supera el stock');

        const loans = [];
        for (let i = 0; i < quantity; i += 1) {
          const copy = available[i];
          const loan = await tx.bookOperation.create({
            data: {
              bookId: makeLoanDto.bookId,
              copyId: copy.id,
              quantity: 1,
              observations: makeLoanDto.observations,
              personId: makeLoanDto.personId,
              personNames: makeLoanDto.personNames,
              personSurNames: makeLoanDto.personSurNames,
              type: 'PRESTAMO'
            }
          });
          await tx.bookCopy.update({ where: { id: copy.id }, data: { status: CopyStatus.PRESTADO } });
          loans.push(loan);
        }

        await recalcBookStock(tx, makeLoanDto.bookId);
        return { state: 'success', message: 'Prestamo hecho', loan: loans[0], loans };
      }

      // 💡 Modo legacy para libros sin ejemplares migrados
      const physicalBook = await tx.physicalBook.findUnique({ where: { id: makeLoanDto.bookId } });
      if (!physicalBook) throw new HttpException('Libro físico no encontrado', HttpStatus.NOT_FOUND);
      if (physicalBook.availableStock - quantity < 0) {
        throw new BadRequestException('La cantidad supera el stock');
      }

      const loan = await tx.bookOperation.create({
        data: {
          bookId: makeLoanDto.bookId,
          quantity,
          observations: makeLoanDto.observations,
          personId: makeLoanDto.personId,
          personNames: makeLoanDto.personNames,
          personSurNames: makeLoanDto.personSurNames,
          type: 'PRESTAMO'
        }
      });

      await tx.physicalBook.update({ where: { id: makeLoanDto.bookId }, data: { availableStock: { decrement: quantity } } });

      if (physicalBook.availableStock - quantity == 0) {
        await tx.physicalBook.update({ where: { id: makeLoanDto.bookId }, data: { status: 'AGOTADO' } });
      }

      return { state: 'success', message: 'Prestamo hecho', loan };
    });
  }

  create(createPhysicalBookOperationDto: CreatePhysicalBookOperationDto) {
    return 'This action adds a new physicalBookOperation';
  }

  findAll() {
    return `This action returns all physicalBookOperation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} physicalBookOperation`;
  }

  update(id: number, updatePhysicalBookOperationDto: UpdatePhysicalBookOperationDto) {
    return `This action updates a #${id} physicalBookOperation`;
  }

  /** Un préstamo sólo puede borrarse del historial una vez devuelto. */
  private isDeletable(operation: { type: OperationType; wasSettled: boolean | null }) {
    return operation.type !== OperationType.PRESTAMO || operation.wasSettled === true;
  }

  async remove(id: string) {
    const operation = await this.prisma.bookOperation.findUnique({ where: { id } });
    if (!operation) throw new HttpException('Operación no encontrada', HttpStatus.NOT_FOUND);
    if (!this.isDeletable(operation)) {
      throw new BadRequestException('No puedes eliminar un préstamo que no se ha devuelto. Líquidalo primero.');
    }

    await this.prisma.bookOperation.delete({ where: { id } });
    return { status: 'success', message: 'Operación eliminada' };
  }

  /**
   * Borrado en lote. Los préstamos pendientes se conservan y se reportan,
   * el resto de movimientos se elimina sin frenar el resto del lote.
   */
  async removeMany(ids: string[]) {
    const operations = await this.prisma.bookOperation.findMany({ where: { id: { in: ids } } });
    const allowedIds = operations.filter((operation) => this.isDeletable(operation)).map((operation) => operation.id);
    const refused = operations.length - allowedIds.length;

    const deleted = allowedIds.length === 0
      ? 0
      : (await this.prisma.bookOperation.deleteMany({ where: { id: { in: allowedIds } } })).count;

    const notFound = ids.length - operations.length;
    return {
      status: 'success',
      message: `${bulkSummaryMessage({ deleted, failed: notFound })}${refused > 0 ? `. ${refused} préstamo(s) sin devolver se mantuvieron` : ''}`,
      data: { deleted, refused }
    };
  }
}
