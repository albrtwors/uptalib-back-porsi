import { Injectable, NotFoundException } from '@nestjs/common';
import { BookService } from '../books.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class BulkBooksService {
    constructor(
        private readonly bookService: BookService,
        private readonly prisma: PrismaService
    ) { }

    async processBulkOperations(operations: any[], req: any) {
        const summary = {
            created: 0, updated: 0, deleted: 0, failed: 0,
            errors: [] as string[], successLog: [] as string[]
        };

        for (const op of operations) {
            try {
                // 💡 RESOLUCIÓN Y AUTOCREACIÓN DE AUTORES MASIVO
                let resolvedAuthorIds: string[] = [];
                if (op.authors && Array.isArray(op.authors)) {
                    for (const authorName of op.authors) {
                        const cleanedName = authorName.trim();
                        if (!cleanedName) continue;

                        let foundAuthor = await this.prisma.author.findFirst({
                            where: { name: { equals: cleanedName, mode: 'insensitive' } }
                        });

                        if (!foundAuthor) {
                            foundAuthor = await this.prisma.author.create({ data: { name: cleanedName } });
                            summary.successLog.push(`[IA Autocreate] Autor creado en lote: "${cleanedName}"`);
                        }
                        resolvedAuthorIds.push(foundAuthor.id);
                    }
                }

                const resolvedPnfs: string[] = Array.isArray(op.pnfs) && op.pnfs.length > 0 ? op.pnfs : ['GENERAL'];

                switch (op.action) {
                    case 'CREATE':
                        if (!op.title) throw new Error('Falta el título para crear el libro.');
                        await this.bookService.create({
                            title: op.title,
                            description: op.description || 'Registrado por lote de IA',
                            routepdf: op.routepdf || 'https://link-pendiente-subida.com',
                            routeimg: op.routeimg || null,
                            pnfs: resolvedPnfs,
                            authorIds: resolvedAuthorIds
                        }, req);
                        summary.created++;
                        summary.successLog.push(`Creado: "${op.title}"`);
                        break;

                    case 'UPDATE':
                        if (!op.searchLookup) throw new Error('No se especificó qué libro editar.');
                        const bookToEdit = await this.prisma.book.findFirst({
                            where: { title: { contains: op.searchLookup, mode: 'insensitive' } }
                        });
                        if (!bookToEdit) throw new NotFoundException(`No se encontró el libro para editar.`);

                        const updatePayload: any = {};
                        if (op.title) updatePayload.title = op.title;
                        if (op.description) updatePayload.description = op.description;
                        if (op.routepdf) updatePayload.routepdf = op.routepdf;
                        if (op.routeimg) updatePayload.routeimg = op.routeimg;
                        if (op.pnfs && op.pnfs.length > 0) updatePayload.pnfs = op.pnfs;
                        if (resolvedAuthorIds.length > 0) updatePayload.authorIds = resolvedAuthorIds;

                        await this.bookService.edit(bookToEdit.id, updatePayload, req);
                        summary.updated++;
                        summary.successLog.push(`Editado: "${bookToEdit.title}"`);
                        break;

                    case 'DELETE':
                        if (!op.searchLookup) throw new Error('No se especificó qué libro eliminar.');
                        const bookToDelete = await this.prisma.book.findFirst({
                            where: { title: { contains: op.searchLookup, mode: 'insensitive' } }
                        });
                        if (!bookToDelete) throw new NotFoundException(`No se encontró el libro para eliminar.`);

                        await this.bookService.delete(bookToDelete.id, req);
                        summary.deleted++;
                        summary.successLog.push(`Eliminado: "${bookToDelete.title}"`);
                        break;

                    default:
                        throw new Error(`Acción desconocida: ${op.action}`);
                }
            } catch (err: any) {
                summary.failed++;
                const target = op.title || op.searchLookup || 'Libro indeterminado';
                summary.errors.push(`Error en [${op.action}] sobre "${target}": ${err.message}`);
            }
        }

        return {
            message: `Lote ejecutado. Creados: ${summary.created}, Editados: ${summary.updated}, Borrados: ${summary.deleted}, Fallidos: ${summary.failed}.`,
            summary
        };
    }
}