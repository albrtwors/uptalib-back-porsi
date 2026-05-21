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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhysicalBookOperationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const getDifference_1 = __importDefault(require("../utils/getDifference"));
let PhysicalBookOperationService = class PhysicalBookOperationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllOperations(query) {
        let QUERY = {};
        const limit = parseInt(query.limit) || 10;
        const page = parseInt(query.page) || 1;
        const skip = (page - 1) * limit;
        if (query.search != '') {
            QUERY.where = { OR: [{ book: { title: { contains: query.search } } }] };
        }
        const totalPages = await this.prisma.bookOperation.count({
            where: QUERY.where
        });
        const data = await this.prisma.bookOperation.findMany({
            ...QUERY, take: limit, skip, orderBy: {
                createdAt: 'desc'
            }, include: {
                book: {
                    select: {
                        title: true,
                        isbn: true
                    }
                }
            }
        });
        return { totalPages, data };
    }
    async addDrops(entriesDto) {
        const existingBook = await this.prisma.physicalBook.findUnique({ where: { id: entriesDto.bookId } });
        const newValue = (0, getDifference_1.default)({ newStockValue: existingBook.totalStock - entriesDto.quantity, oldCurrentStockValue: existingBook.totalStock, oldAvailableStockValue: existingBook.availableStock });
        if (newValue < 0)
            throw new common_1.BadRequestException('Hay prestamos pendientes, las bajas no pueden tener un valor superior a la cantidad de stock disponible');
        const book = await this.prisma.physicalBook.update({
            where: { id: entriesDto.bookId }, data: {
                availableStock: {
                    decrement: entriesDto.quantity
                },
                totalStock: {
                    decrement: entriesDto.quantity
                }
            }
        });
        await this.prisma.bookOperation.create({
            data: {
                bookId: entriesDto.bookId,
                quantity: entriesDto.quantity,
                type: 'BAJA',
                personNames: entriesDto.personNames,
                personSurNames: entriesDto.personSurNames
            }
        });
        return { status: 'success', message: 'Bajas añadidas' };
    }
    async addEntries(entriesDto) {
        console.log(entriesDto);
        const book = await this.prisma.physicalBook.update({
            where: { id: entriesDto.bookId }, data: {
                availableStock: {
                    increment: entriesDto.quantity
                },
                totalStock: {
                    increment: entriesDto.quantity
                }
            }
        });
        await this.prisma.bookOperation.create({
            data: {
                bookId: entriesDto.bookId,
                quantity: entriesDto.quantity,
                type: 'ENTRADA',
                personNames: entriesDto.personNames,
                personSurNames: entriesDto.personSurNames
            }
        });
        return { status: 'success', message: 'Entradas añadidas' };
    }
    async findAllLoans(query) {
        const QUERY = {};
        const page = query.page || 1;
        const limit = query.limit || 10;
        const skip = (page - 1) * limit;
        if (query.search) {
            QUERY.where = { type: 'PRESTAMO', OR: [{ book: { title: { contains: query.search } } }] };
        }
        QUERY.take = parseInt(limit);
        QUERY.skip = parseInt(skip);
        const data = await this.prisma.bookOperation.findMany({
            ...QUERY, where: { ...QUERY.where, wasSettled: false, type: 'PRESTAMO' }, include: {
                book: {
                    select: {
                        title: true
                    }
                },
            }
        });
        const totalPages = await this.prisma.bookOperation.count({
            where: { ...QUERY.where, type: 'PRESTAMO', wasSettled: false }
        });
        return { data, totalPages };
    }
    async settle(id) {
        const existingLoan = await this.prisma.bookOperation.findUnique({ where: { id } });
        await this.prisma.bookOperation.create({
            data: {
                bookId: existingLoan.bookId,
                quantity: existingLoan.quantity,
                observations: existingLoan.observations,
                personId: existingLoan.personId,
                personNames: existingLoan.personNames,
                personSurNames: existingLoan.personSurNames,
                type: 'DEVOLUCION',
            }
        });
        const loan = await this.prisma.bookOperation.update({
            where: { id }, data: {
                wasSettled: true,
                book: {
                    update: {
                        availableStock: {
                            increment: existingLoan.quantity
                        }
                    }
                }
            }
        });
        return { state: 'success', message: 'El libro ha sido devuelto' };
    }
    async loan(makeLoanDto) {
        return await this.prisma.$transaction(async (tx) => {
            const loan = await tx.bookOperation.create({ data: { ...makeLoanDto, type: 'PRESTAMO' } });
            const physicalBook = await tx.physicalBook.findUnique({ where: { id: loan.bookId } });
            if (physicalBook.availableStock - loan.quantity < 0) {
                throw new common_1.BadRequestException('La cantidad supera el stock');
            }
            await tx.physicalBook.update({ where: { id: loan.bookId }, data: { availableStock: { decrement: loan.quantity } } });
            if (physicalBook.availableStock - loan.quantity == 0) {
                await tx.physicalBook.update({ where: { id: loan.bookId }, data: { status: 'AGOTADO' } });
            }
            return { state: 'success', message: 'Prestamo hecho', loan: loan };
        });
    }
    create(createPhysicalBookOperationDto) {
        return 'This action adds a new physicalBookOperation';
    }
    findAll() {
        return `This action returns all physicalBookOperation`;
    }
    findOne(id) {
        return `This action returns a #${id} physicalBookOperation`;
    }
    update(id, updatePhysicalBookOperationDto) {
        return `This action updates a #${id} physicalBookOperation`;
    }
    remove(id) {
        return `This action removes a #${id} physicalBookOperation`;
    }
};
exports.PhysicalBookOperationService = PhysicalBookOperationService;
exports.PhysicalBookOperationService = PhysicalBookOperationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PhysicalBookOperationService);
//# sourceMappingURL=physical-book-operation.service.js.map