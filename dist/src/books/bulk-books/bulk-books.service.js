"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkBooksService = void 0;
const common_1 = require("@nestjs/common");
const books_service_1 = require("../books.service");
const prisma_service_1 = require("../../../prisma/prisma.service");
let BulkBooksService = class BulkBooksService {
    constructor(bookService, prisma) {
        this.bookService = bookService;
        this.prisma = prisma;
    }
    async processBulkOperations(operations, req) {
        const summary = {
            created: 0, updated: 0, deleted: 0, failed: 0,
            errors: [], successLog: []
        };
        for (const op of operations) {
            try {
                let resolvedAuthorIds = [];
                if (op.authors && Array.isArray(op.authors)) {
                    for (const authorName of op.authors) {
                        const cleanedName = authorName.trim();
                        if (!cleanedName)
                            continue;
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
                const resolvedPnfs = Array.isArray(op.pnfs) && op.pnfs.length > 0 ? op.pnfs : ['GENERAL'];
                switch (op.action) {
                    case 'CREATE':
                        if (!op.title)
                            throw new Error('Falta el título para crear el libro.');
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
                        if (!op.searchLookup)
                            throw new Error('No se especificó qué libro editar.');
                        const bookToEdit = await this.prisma.book.findFirst({
                            where: { title: { contains: op.searchLookup, mode: 'insensitive' } }
                        });
                        if (!bookToEdit)
                            throw new common_1.NotFoundException(`No se encontró el libro para editar.`);
                        const updatePayload = {};
                        if (op.title)
                            updatePayload.title = op.title;
                        if (op.description)
                            updatePayload.description = op.description;
                        if (op.routepdf)
                            updatePayload.routepdf = op.routepdf;
                        if (op.routeimg)
                            updatePayload.routeimg = op.routeimg;
                        if (op.pnfs && op.pnfs.length > 0)
                            updatePayload.pnfs = op.pnfs;
                        if (resolvedAuthorIds.length > 0)
                            updatePayload.authorIds = resolvedAuthorIds;
                        await this.bookService.edit(bookToEdit.id, updatePayload, req);
                        summary.updated++;
                        summary.successLog.push(`Editado: "${bookToEdit.title}"`);
                        break;
                    case 'DELETE':
                        if (!op.searchLookup)
                            throw new Error('No se especificó qué libro eliminar.');
                        const bookToDelete = await this.prisma.book.findFirst({
                            where: { title: { contains: op.searchLookup, mode: 'insensitive' } }
                        });
                        if (!bookToDelete)
                            throw new common_1.NotFoundException(`No se encontró el libro para eliminar.`);
                        await this.bookService.delete(bookToDelete.id, req);
                        summary.deleted++;
                        summary.successLog.push(`Eliminado: "${bookToDelete.title}"`);
                        break;
                    default:
                        throw new Error(`Acción desconocida: ${op.action}`);
                }
            }
            catch (err) {
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
};
exports.BulkBooksService = BulkBooksService;
exports.BulkBooksService = BulkBooksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [books_service_1.BookService,
        prisma_service_1.PrismaService])
], BulkBooksService);
//# sourceMappingURL=bulk-books.service.js.map