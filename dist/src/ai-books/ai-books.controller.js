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
exports.AiBooksController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const ai_books_service_1 = require("./ai-books.service");
const bulk_books_service_1 = require("../books/bulk-books/bulk-books.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let AiBooksController = class AiBooksController {
    constructor(aiBooksService, bulkBooksService) {
        this.aiBooksService = aiBooksService;
        this.bulkBooksService = bulkBooksService;
    }
    async handleChatbotIntent(message, currentBookJson, file) {
        let contextInput = message || '';
        const currentBook = currentBookJson ? JSON.parse(currentBookJson) : undefined;
        if (file) {
            contextInput += `\n[Archivo adjunto detectado: "${file.originalname}"].`;
        }
        return this.aiBooksService.processBookIntent(contextInput, currentBook);
    }
    async handleBulkExecution(message, req, file) {
        let contextInput = message || '';
        if (file)
            contextInput += `\n[Archivo adjunto detectado: "${file.originalname}"].`;
        const aiResult = await this.aiBooksService.processBulkIntent(contextInput);
        const executionResult = await this.bulkBooksService.processBulkOperations(aiResult.extractedData, req);
        return {
            ...executionResult,
            aiAnalysis: aiResult.message
        };
    }
};
exports.AiBooksController = AiBooksController;
__decorate([
    (0, common_1.Post)('chat'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Body)('message')),
    __param(1, (0, common_1.Body)('currentBook')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AiBooksController.prototype, "handleChatbotIntent", null);
__decorate([
    (0, common_1.Post)('bulk-execute'),
    (0, roles_decorator_1.Roles)(client_1.Role.LIBRARIAN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Body)('message')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AiBooksController.prototype, "handleBulkExecution", null);
exports.AiBooksController = AiBooksController = __decorate([
    (0, common_1.Controller)('ai-books'),
    __metadata("design:paramtypes", [ai_books_service_1.AiBooksService,
        bulk_books_service_1.BulkBooksService])
], AiBooksController);
//# sourceMappingURL=ai-books.controller.js.map