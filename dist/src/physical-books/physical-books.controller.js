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
exports.PhysicalBooksController = void 0;
const common_1 = require("@nestjs/common");
const physical_books_service_1 = require("./physical-books.service");
const create_physical_book_dto_1 = require("./dto/create-physical-book.dto");
const update_physical_book_dto_1 = require("./dto/update-physical-book.dto");
const client_1 = require("@prisma/client");
const roles_guard_1 = require("../auth/guards/roles.guard");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let PhysicalBooksController = class PhysicalBooksController {
    constructor(physicalBooksService) {
        this.physicalBooksService = physicalBooksService;
    }
    create(createPhysicalBookDto) {
        return this.physicalBooksService.create(createPhysicalBookDto);
    }
    findAll(query) {
        return this.physicalBooksService.findAll(query);
    }
    findOne(id) {
        return 'this.physicalBooksService.findOne(+id);';
    }
    update(id, updatePhysicalBookDto) {
        return this.physicalBooksService.update(id, updatePhysicalBookDto);
    }
    remove(id) {
        return this.physicalBooksService.remove(id);
    }
};
exports.PhysicalBooksController = PhysicalBooksController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_physical_book_dto_1.CreatePhysicalBookDto]),
    __metadata("design:returntype", void 0)
], PhysicalBooksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PhysicalBooksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PhysicalBooksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_physical_book_dto_1.UpdatePhysicalBookDto]),
    __metadata("design:returntype", void 0)
], PhysicalBooksController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PhysicalBooksController.prototype, "remove", null);
exports.PhysicalBooksController = PhysicalBooksController = __decorate([
    (0, common_1.Controller)('physical-book'),
    __metadata("design:paramtypes", [physical_books_service_1.PhysicalBooksService])
], PhysicalBooksController);
//# sourceMappingURL=physical-books.controller.js.map