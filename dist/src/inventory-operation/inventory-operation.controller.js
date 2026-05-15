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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryOperationController = void 0;
const common_1 = require("@nestjs/common");
const inventory_operation_service_1 = require("./inventory-operation.service");
const create_inventory_operation_dto_1 = require("./dto/create-inventory-operation.dto");
const update_inventory_operation_dto_1 = require("./dto/update-inventory-operation.dto");
const entrie_dto_1 = require("./dto/entrie-dto");
const drop_dto_1 = require("./dto/drop-dto");
const loan_dto_1 = require("./dto/loan-dto");
const client_1 = require("@prisma/client");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
let InventoryOperationController = class InventoryOperationController {
    constructor(inventoryOperationService) {
        this.inventoryOperationService = inventoryOperationService;
    }
    addEntries(entriesDto) {
        return this.inventoryOperationService.addEntries(entriesDto);
    }
    addDrops(entriesDto) {
        return this.inventoryOperationService.addDrops(entriesDto);
    }
    findAllLoans(query) {
        return this.inventoryOperationService.findAllLoans(query);
    }
    loan(itemLoan) {
        return this.inventoryOperationService.loan(itemLoan);
    }
    settle(id) {
        return this.inventoryOperationService.settle(id);
    }
    create(createInventoryOperationDto) {
        return this.inventoryOperationService.create(createInventoryOperationDto);
    }
    findAll(query) {
        return this.inventoryOperationService.findAll(query);
    }
    findOne(id) {
        return this.inventoryOperationService.findOne(+id);
    }
    update(id, updateInventoryOperationDto) {
        return this.inventoryOperationService.update(+id, updateInventoryOperationDto);
    }
    remove(id) {
        return this.inventoryOperationService.remove(+id);
    }
};
exports.InventoryOperationController = InventoryOperationController;
__decorate([
    (0, common_1.Patch)('entries'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entrie_dto_1.EntrieDto]),
    __metadata("design:returntype", void 0)
], InventoryOperationController.prototype, "addEntries", null);
__decorate([
    (0, common_1.Patch)('drops'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [drop_dto_1.DropDto]),
    __metadata("design:returntype", void 0)
], InventoryOperationController.prototype, "addDrops", null);
__decorate([
    (0, common_1.Get)('loan'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryOperationController.prototype, "findAllLoans", null);
__decorate([
    (0, common_1.Post)('loan'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [loan_dto_1.LoanDto]),
    __metadata("design:returntype", void 0)
], InventoryOperationController.prototype, "loan", null);
__decorate([
    (0, common_1.Patch)('settle/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryOperationController.prototype, "settle", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_inventory_operation_dto_1.CreateInventoryOperationDto]),
    __metadata("design:returntype", void 0)
], InventoryOperationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryOperationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryOperationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_inventory_operation_dto_1.UpdateInventoryOperationDto]),
    __metadata("design:returntype", void 0)
], InventoryOperationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryOperationController.prototype, "remove", null);
exports.InventoryOperationController = InventoryOperationController = __decorate([
    (0, common_1.Controller)('inventory-operation'),
    __metadata("design:paramtypes", [inventory_operation_service_1.InventoryOperationService])
], InventoryOperationController);
//# sourceMappingURL=inventory-operation.controller.js.map