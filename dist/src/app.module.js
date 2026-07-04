"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./user/user.module");
const books_module_1 = require("./books/books.module");
const inventory_module_1 = require("./inventory/inventory.module");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const platform_express_1 = require("@nestjs/platform-express");
const physical_books_module_1 = require("./physical-books/physical-books.module");
const category_module_1 = require("./category/category.module");
const author_module_1 = require("./author/author.module");
const physical_book_operation_module_1 = require("./physical-book-operation/physical-book-operation.module");
const item_type_module_1 = require("./item-type/item-type.module");
const inventory_operation_module_1 = require("./inventory-operation/inventory-operation.module");
const logs_module_1 = require("./logs/logs.module");
const backup_module_1 = require("./backup/backup.module");
const ai_books_module_1 = require("./ai-books/ai-books.module");
const ai_inventory_module_1 = require("./ai-inventory/ai-inventory.module");
const ai_physical_book_module_1 = require("./ai-physical-book/ai-physical-book.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), 'public'),
                serveRoot: '/public',
            }),
            platform_express_1.MulterModule.register({
                dest: '/public/uploads'
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            user_module_1.UsersModule,
            books_module_1.BooksModule,
            inventory_module_1.InventoryModule,
            physical_books_module_1.PhysicalBooksModule,
            category_module_1.CategoryModule,
            author_module_1.AuthorModule,
            physical_book_operation_module_1.PhysicalBookOperationModule,
            item_type_module_1.ItemTypeModule,
            inventory_operation_module_1.InventoryOperationModule,
            logs_module_1.LogsModule,
            backup_module_1.BackupModule,
            ai_books_module_1.AiBooksModule,
            ai_inventory_module_1.AiInventoryModule,
            ai_physical_book_module_1.AiPhysicalBookModule,
        ],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map