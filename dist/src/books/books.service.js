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
        return await this.prisma.book.findUnique({
            where: { id },
            include: {
                pnfs: true,
                authors: true
            }
        });
    }
    async findAll(query) {
        const take = parseInt(query.limit) || 10;
        const page = parseInt(query.page) || 1;
        const skip = (page - 1) * take;
        const search = query.search;
        const pnf = query.pnf;
        const authorsParam = query.authors;
        const andConditions = [];
        if (pnf && pnf.trim() !== "") {
            andConditions.push({
                pnfs: {
                    some: {
                        pnf: pnf.trim().toUpperCase()
                    }
                }
            });
        }
        if (authorsParam && authorsParam.trim() !== "") {
            const authorIdsArray = authorsParam.split(',').map((id) => id.trim()).filter(Boolean);
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
        const where = andConditions.length > 0 ? { AND: andConditions } : {};
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
    async create(data, req) {
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
                    create: pnfs.map(pnfItem => ({ pnf: pnfItem }))
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
    async delete(id, req) {
        const book = await this.prisma.book.findFirst({ where: { id } });
        if (!book)
            throw new common_1.NotFoundException('El libro no existe');
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
    async edit(id, data, req) {
        const book = await this.prisma.book.findFirst({ where: { id } });
        if (!book)
            throw new common_1.NotFoundException('El libro no existe');
        const { title, description, routepdf, routeimg, pnfs, authorIds } = data;
        const updateData = {
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
                create: pnfs.map(pnfItem => ({ pnf: pnfItem }))
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
    async saveToUser(userId, bookId) {
        const book = await this.prisma.book.findUnique({ where: { id: bookId } });
        if (!book)
            throw new common_1.NotFoundException('El libro no existe');
        try {
            return {
                message: "Libro Guardado",
                data: await this.prisma.savedBook.create({
                    data: { userId, bookId },
                })
            };
        }
        catch (error) {
            throw new common_1.ConflictException('Ya tienes este libro guardado');
        }
    }
    async removeFromUser(userId, bookId) {
        const savedBook = await this.prisma.savedBook.findMany({
            where: { userId, bookId }
        });
        if (savedBook.length === 0)
            throw new common_1.NotFoundException('El libro no estaba guardado por este usuario');
        await this.prisma.savedBook.delete({
            where: { id: savedBook[0].id, userId }
        });
        return { message: 'Libro eliminado', data: savedBook };
    }
    async getVerifyLike(userId, bookId) {
        const savedBook = await this.prisma.savedBook.findMany({
            where: { userId, bookId }
        });
        return savedBook[0] ? true : false;
    }
    async getSavedBooks(userId, query) {
        const where = { userId };
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
};
exports.BookService = BookService;
exports.BookService = BookService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookService);
//# sourceMappingURL=books.service.js.map