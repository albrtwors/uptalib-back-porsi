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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookController = void 0;
const common_1 = require("@nestjs/common");
const books_service_1 = require("./books.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = __importDefault(require("path"));
const storage_1 = require("./utils/storage");
const uploadFile_1 = require("../utils/uploadFile");
const deleteFile_1 = require("../utils/deleteFile");
let BookController = class BookController {
    constructor(bookService) {
        this.bookService = bookService;
    }
    findAll(query) {
        return this.bookService.findAll(query);
    }
    getMyLibrary(req, query) {
        return this.bookService.getSavedBooks(req.user.userId, query);
    }
    findOne(id) {
        return this.bookService.findOne(id);
    }
    async create(data, req, file) {
        if (!file) {
            throw new Error('No se ha subido ningún archivo');
        }
        const sanitizedTitle = data.title
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]/g, '_')
            .replace(/_+/g, '_');
        const fileExt = path_1.default.extname(file.originalname) || '.pdf';
        const newFileName = `${sanitizedTitle}${fileExt}`;
        const finalPath = await (0, uploadFile_1.uploadFile)(file, 'pdfs', newFileName);
        console.log(finalPath);
        return this.bookService.create({ ...data, routepdf: finalPath }, req);
    }
    async delete(id, req) {
        const book = await this.bookService.findOne(id);
        if (!book) {
            throw new common_1.NotFoundException('El libro no existe');
        }
        if (book && book.routepdf) {
            const bucketName = 'pdfs';
            const supabasePath = book.routepdf.split(`${bucketName}/`)[1];
            if (supabasePath) {
                await (0, deleteFile_1.deleteFile)(supabasePath, 'pdfs');
            }
        }
        return this.bookService.delete(id, req);
    }
    async edit(id, data, pdfFile, req) {
        const existingBook = await this.bookService.findOne(id);
        if (!existingBook) {
            throw new common_1.NotFoundException('El libro no existe');
        }
        let updateData = data;
        if (pdfFile) {
            const sanitizedTitle = existingBook.title || data.title
                .toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]/g, '_')
                .replace(/_+/g, '_');
            const fileExt = path_1.default.extname(pdfFile.originalname) || '.pdf';
            const newFileName = `${sanitizedTitle}${fileExt}`;
            const finalPath = await (0, uploadFile_1.uploadFile)(pdfFile, 'pdfs', newFileName);
            updateData = { ...data, routepdf: finalPath };
        }
        return this.bookService.edit(id, updateData, req);
    }
    verifyLike(req, bookId) {
        return this.bookService.getVerifyLike(req.user.userId, bookId);
    }
    removeLike(req, bookId) {
        return this.bookService.removeFromUser(req.user.userId, bookId);
    }
    save(req, bookId) {
        return this.bookService.saveToUser(req.user.userId, bookId);
    }
};
exports.BookController = BookController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BookController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-library'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], BookController.prototype, "getMyLibrary", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], BookController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPERADMIN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('pdf', { storage: (0, multer_1.memoryStorage)() })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPERADMIN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "delete", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPERADMIN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('pdf', storage_1.storageFor1File)),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], BookController.prototype, "edit", null);
__decorate([
    (0, common_1.Get)('verify-like/:bookId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('bookId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], BookController.prototype, "verifyLike", null);
__decorate([
    (0, common_1.Post)('remove-like/:bookId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('bookId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], BookController.prototype, "removeLike", null);
__decorate([
    (0, common_1.Post)('save/:bookId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('bookId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], BookController.prototype, "save", null);
exports.BookController = BookController = __decorate([
    (0, common_1.Controller)('book'),
    __metadata("design:paramtypes", [books_service_1.BookService])
], BookController);
//# sourceMappingURL=books.controller.js.map