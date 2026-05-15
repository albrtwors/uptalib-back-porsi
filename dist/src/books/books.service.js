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
exports.BookService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let BookService = class BookService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findOne(id) {
        const book = await this.prisma.book.findUnique({ where: { id } });
        return book;
    }
    async findAll(query) {
        const take = parseInt(query.limit) || 10;
        const page = parseInt(query.page) || 1;
        const skip = (page - 1) * take;
        const search = query.search;
        const where = {};
        if (search) {
            where.OR = [
                {
                    title: { contains: search },
                },
                {
                    description: { contains: search }
                }
            ];
        }
        const totalPages = await this.prisma.book.count({ where });
        const data = await this.prisma.book.findMany({
            take,
            skip,
            where,
        });
        return { data, totalPages };
    }
    async create(data, req) {
        const book = await this.prisma.book.create({ data });
        await this.prisma.operation.create({ data: { userId: req.user.userId, ip: req.ip, action: `creó el libro Digital ${data.title}` } });
        return { message: 'Libro Creado' };
    }
    async delete(id, req) {
        const book = await this.prisma.book.findFirst({ where: { id } });
        await this.prisma.savedBook.deleteMany({ where: { bookId: id } });
        await this.prisma.operation.create({ data: { userId: req.user.userId, ip: req.ip, action: `Eliminó el libro Digital ${book.title}` } });
        return { book: await this.prisma.book.delete({ where: { id } }), message: 'Libro Eliminado' };
    }
    async edit(id, data, req) {
        const book = await this.prisma.book.findFirst({ where: { id } });
        await this.prisma.operation.create({ data: { userId: req.user.userId, ip: req.ip, action: `Editó el libro Digital ${book.title}` } });
        return { book: await this.prisma.book.update({ where: { id }, data: data }), message: 'Libro editado' };
    }
    async saveToUser(userId, bookId) {
        const book = await this.prisma.book.findUnique({ where: { id: bookId } });
        if (!book)
            throw new common_1.NotFoundException('El libro no existe');
        try {
            return {
                message: "Libro Guardado", data: await this.prisma.savedBook.create({
                    data: {
                        userId,
                        bookId,
                    },
                })
            };
        }
        catch (error) {
            throw new common_1.ConflictException('Ya tienes este libro guardado');
        }
    }
    async removeFromUser(userId, bookId) {
        const savedBook = await this.prisma.savedBook.findMany({
            where: {
                userId,
                bookId: bookId
            }
        });
        await this.prisma.savedBook.delete({
            where: { id: savedBook[0].id, userId }
        });
        return { message: 'Libro eliminado', data: savedBook };
    }
    async getVerifyLike(userId, bookId) {
        const savedBook = await this.prisma.savedBook.findMany({
            where: {
                userId,
                bookId
            }
        });
        return savedBook[0] ? true : false;
    }
    async getSavedBooks(userId, query) {
        console.log(userId);
        const where = { userId };
        const page = parseInt(query.page) || 1;
        const take = parseInt(query.limit) || 10;
        const skip = (page - 1) * 1;
        if (query.search) {
            where.OR = [
                { book: { title: { contains: query.search } } }
            ];
        }
        const totalPages = await this.prisma.savedBook.count({ where });
        const data = await this.prisma.savedBook.findMany({
            where,
            take, skip,
            include: {
                book: true,
            },
        });
        return { data, totalPages };
    }
};
exports.BookService = BookService;
exports.BookService = BookService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookService);
//# sourceMappingURL=books.service.js.map