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
exports.PhysicalBooksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PhysicalBooksService = class PhysicalBooksService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createPhysicalBookDto) {
        return this.prisma.$transaction(async (tx) => {
            const { authorId, categoryId, authorName, categoryName, ...restOfDto } = createPhysicalBookDto;
            let resolvedAuthorId = authorId;
            let resolvedCategoryId = categoryId;
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
    async update(id, updatePhysicalBookDto) {
        return await this.prisma.$transaction(async (tx) => {
            const currentBook = await tx.physicalBook.findUnique({ where: { id } });
            if (!currentBook)
                throw new common_1.HttpException('Libro físico no encontrado', common_1.HttpStatus.NOT_FOUND);
            const { authorId, categoryId, authorName, categoryName, ...restOfDto } = updatePhysicalBookDto;
            let resolvedAuthorId = authorId;
            let resolvedCategoryId = categoryId;
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
                throw new common_1.HttpException('Cantidad incorrecta, resuelve los préstamos del libro primero', common_1.HttpStatus.BAD_REQUEST);
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
    async findAll(query) {
        const take = parseInt(query.limit) || 10;
        const page = parseInt(query.page) || 1;
        const skip = (page - 1) * take;
        const search = query.search;
        const where = {};
        query.pnf = query.pnf == 'undefined' || query.pnf == '' ? 'todos' : query.pnf;
        query.genre = query.genre == 'undefined' ? '' : query.genre;
        if (search) {
            where.AND = [{ title: { contains: search, mode: 'insensitive' } }];
        }
        if (query.genre) {
            const genreFilter = {
                category: {
                    name: {
                        contains: query.genre,
                        mode: 'insensitive'
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
    async remove(id) {
        await this.prisma.bookOperation.deleteMany({ where: { bookId: id } });
        await this.prisma.physicalBook.delete({ where: { id } });
        return { status: 'success', message: 'Libro físico eliminado' };
    }
};
exports.PhysicalBooksService = PhysicalBooksService;
exports.PhysicalBooksService = PhysicalBooksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PhysicalBooksService);
//# sourceMappingURL=physical-books.service.js.map