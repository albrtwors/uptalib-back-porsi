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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const getPagination_1 = require("../functions/pagination/getPagination");
let InventoryService = class InventoryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createInventoryDto) {
        return { item: await this.prisma.item.create({ data: { typeId: createInventoryDto.typeId, name: createInventoryDto.name, description: createInventoryDto.description, code: createInventoryDto.code, availableStock: createInventoryDto.stock, totalStock: createInventoryDto.stock, status: 'DISPONIBLE' } }), message: 'Item añadido' };
    }
    async findAll(query) {
        const search = query.search;
        const where = {};
        const { take, page, skip } = (0, getPagination_1.getPagination)(query);
        if (search) {
            where.AND = [
                {
                    name: { contains: search },
                },
            ];
        }
        if (query.type) {
            if (!where.AND)
                where.AND = [{ type: { name: { contains: query.type } } }];
            else
                where.AND.push({ type: { name: { contains: query.type } } });
        }
        const totalPages = Math.ceil(await this.prisma.item.count({ where }) / take);
        const data = await this.prisma.item.findMany({
            where, skip, take, include: {
                type: true
            }
        });
        return { data, totalPages };
    }
    findOne(id) {
        return `This action returns a #${id} inventorsyss`;
    }
    async edit(id, updateInventoryDto) {
        return { item: await this.prisma.item.update({ where: { id }, data: { typeId: updateInventoryDto.typeId, name: updateInventoryDto.name, description: updateInventoryDto.description, code: updateInventoryDto.code, availableStock: updateInventoryDto.stock, totalStock: updateInventoryDto.stock, status: 'DISPONIBLE' } }), message: 'Item actualizado' };
    }
    async delete(id) {
        await this.prisma.itemOperation.deleteMany({ where: { itemId: id } });
        return { item: await this.prisma.item.delete({ where: { id } }), message: 'Item Eliminado' };
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map