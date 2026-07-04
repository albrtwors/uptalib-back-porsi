"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiPhysicalBookModule = void 0;
const common_1 = require("@nestjs/common");
const ai_physical_book_service_1 = require("./ai-physical-book.service");
const ai_physical_book_controller_1 = require("./ai-physical-book.controller");
const config_1 = require("@nestjs/config");
let AiPhysicalBookModule = class AiPhysicalBookModule {
};
exports.AiPhysicalBookModule = AiPhysicalBookModule;
exports.AiPhysicalBookModule = AiPhysicalBookModule = __decorate([
    (0, common_1.Module)({
        controllers: [ai_physical_book_controller_1.AiPhysicalBookController],
        providers: [ai_physical_book_service_1.AiPhysicalBookService],
        imports: [config_1.ConfigModule]
    })
], AiPhysicalBookModule);
//# sourceMappingURL=ai-physical-book.module.js.map