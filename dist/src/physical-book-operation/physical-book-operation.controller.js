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
exports.PhysicalBookOperationController = void 0;
const common_1 = require("@nestjs/common");
const physical_book_operation_service_1 = require("./physical-book-operation.service");
const update_physical_book_operation_dto_1 = require("./dto/update-physical-book-operation.dto");
const entrie_dto_1 = require("./dto/entrie-dto");
const drop_dto_1 = require("./dto/drop-dto");
const loan_dto_1 = require("./dto/loan-dto");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
let PhysicalBookOperationController = class PhysicalBookOperationController {
    constructor(physicalBookOperationService) {
        this.physicalBookOperationService = physicalBookOperationService;
    }
    findAll(quer) {
        return this.physicalBookOperationService.findAllOperations(quer);
    }
    addEntries(entriesDto) {
        return this.physicalBookOperationService.addEntries(entriesDto);
    }
    addDrops(entriesDto) {
        return this.physicalBookOperationService.addDrops(entriesDto);
    }
    loan(makeLoanDto) {
        return this.physicalBookOperationService.loan(makeLoanDto);
    }
    settle(id) {
        console.log(id);
        return this.physicalBookOperationService.settle(id);
    }
    findAllLoans(query) {
        return this.physicalBookOperationService.findAllLoans(query);
    }
    findOne(id) {
        return this.physicalBookOperationService.findOne(+id);
    }
    update(id, updatePhysicalBookOperationDto) {
        return this.physicalBookOperationService.update(+id, updatePhysicalBookOperationDto);
    }
    remove(id) {
        return this.physicalBookOperationService.remove(+id);
    }
};
exports.PhysicalBookOperationController = PhysicalBookOperationController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PhysicalBookOperationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)('entries'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [entrie_dto_1.EntrieDto]),
    __metadata("design:returntype", void 0)
], PhysicalBookOperationController.prototype, "addEntries", null);
__decorate([
    (0, common_1.Patch)('drops'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [drop_dto_1.DropDto]),
    __metadata("design:returntype", void 0)
], PhysicalBookOperationController.prototype, "addDrops", null);
__decorate([
    (0, common_1.Post)('loan'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [loan_dto_1.LoanDto]),
    __metadata("design:returntype", void 0)
], PhysicalBookOperationController.prototype, "loan", null);
__decorate([
    (0, common_1.Patch)('settle/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PhysicalBookOperationController.prototype, "settle", null);
__decorate([
    (0, common_1.Get)('loan'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PhysicalBookOperationController.prototype, "findAllLoans", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PhysicalBookOperationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_physical_book_operation_dto_1.UpdatePhysicalBookOperationDto]),
    __metadata("design:returntype", void 0)
], PhysicalBookOperationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PhysicalBookOperationController.prototype, "remove", null);
exports.PhysicalBookOperationController = PhysicalBookOperationController = __decorate([
    (0, common_1.Controller)('physical-book-operation'),
    __metadata("design:paramtypes", [physical_book_operation_service_1.PhysicalBookOperationService])
], PhysicalBookOperationController);
//# sourceMappingURL=physical-book-operation.controller.js.map