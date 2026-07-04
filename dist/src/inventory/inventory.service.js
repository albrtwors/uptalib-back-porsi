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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const getPagination_1 = require("../functions/pagination/getPagination");
const getDifference_1 = __importDefault(require("../utils/getDifference"));
let InventoryService = class InventoryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createInventoryDto) {
        return this.prisma.$transaction(async (tx) => {
            const { typeId, typeName, stock, ...restOfDto } = createInventoryDto;
            let resolvedTypeId = typeId;
            if (!resolvedTypeId && typeName && typeName.trim() !== '') {
                const cleanedTypeName = typeName.trim();
                let itemType = await tx.itemType.findFirst({
                    where: { name: { equals: cleanedTypeName, mode: 'insensitive' } }
                });
                if (!itemType) {
                    itemType = await tx.itemType.create({
                        data: { name: cleanedTypeName }
                    });
                }
                resolvedTypeId = itemType.id;
            }
            const parsedStock = parseInt(stock) || 0;
            const item = await tx.item.create({
                data: {
                    ...restOfDto,
                    typeId: resolvedTypeId || undefined,
                    availableStock: parsedStock,
                    totalStock: parsedStock,
                    status: 'DISPONIBLE'
                }
            });
            return { item, message: 'Item añadido exitosamente' };
        });
    }
    async findAll(query) {
        const search = query.search;
        const where = {};
        const { take, page, skip } = (0, getPagination_1.getPagination)(query);
        if (search) {
            where.AND = [
                {
                    name: { contains: search, mode: 'insensitive' },
                },
            ];
        }
        if (query.type) {
            const typeFilter = {
                type: {
                    name: { contains: query.type, mode: 'insensitive' }
                }
            };
            if (!where.AND)
                where.AND = [typeFilter];
            else
                where.AND.push(typeFilter);
        }
        const totalPages = Math.ceil(await this.prisma.item.count({ where }) / take);
        const data = await this.prisma.item.findMany({
            where,
            skip,
            take,
            include: {
                type: true
            }
        });
        return { data, totalPages };
    }
    findOne(id) {
        return `This action returns a #${id} inventory item`;
    }
    async edit(id, updateInventoryDto) {
        return this.prisma.$transaction(async (tx) => {
            const existingItem = await tx.item.findUnique({ where: { id } });
            if (!existingItem)
                throw new common_1.HttpException('Item no encontrado', common_1.HttpStatus.NOT_FOUND);
            const { typeId, typeName, stock, ...restOfDto } = updateInventoryDto;
            let resolvedTypeId = typeId;
            if (!resolvedTypeId && typeName && typeName.trim() !== '') {
                const cleanedTypeName = typeName.trim();
                let itemType = await tx.itemType.findFirst({
                    where: { name: { equals: cleanedTypeName, mode: 'insensitive' } }
                });
                if (!itemType) {
                    itemType = await tx.itemType.create({
                        data: { name: cleanedTypeName }
                    });
                }
                resolvedTypeId = itemType.id;
            }
            const parsedStock = parseInt(stock) || existingItem.totalStock;
            const newValue = (0, getDifference_1.default)({
                oldAvailableStockValue: existingItem.availableStock,
                oldCurrentStockValue: existingItem.totalStock,
                newStockValue: parsedStock
            });
            if (newValue < 0) {
                throw new common_1.HttpException("Hay préstamos pendientes que impiden que reduzcas tanto el stock", common_1.HttpStatus.BAD_REQUEST);
            }
            const item = await tx.item.update({
                where: { id },
                data: {
                    ...restOfDto,
                    typeId: resolvedTypeId || undefined,
                    availableStock: parsedStock,
                    totalStock: newValue,
                    status: 'DISPONIBLE'
                }
            });
            return { item, message: 'Item actualizado con éxito' };
        });
    }
    async delete(id) {
        await this.prisma.itemOperation.deleteMany({ where: { itemId: id } });
        const item = await this.prisma.item.delete({ where: { id } });
        return { item, message: 'Item Eliminado correctamente' };
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map