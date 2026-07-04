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
exports.CreatePhysicalBookDto = void 0;
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CreatePhysicalBookDto {
}
exports.CreatePhysicalBookDto = CreatePhysicalBookDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'El título del libro debe ser una cadena de texto' }),
    (0, class_validator_1.MinLength)(3, { message: 'El nombre del libro debe tener mínimo 3 caracteres' }),
    __metadata("design:type", String)
], CreatePhysicalBookDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El código ISBN debe ser cadena de texto' }),
    __metadata("design:type", String)
], CreatePhysicalBookDto.prototype, "isbn", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    (0, class_validator_1.IsInt)({ message: 'El año de publicación debe ser un número entero' }),
    (0, class_validator_1.IsPositive)({ message: 'El año de publicación debe ser un número positivo' }),
    __metadata("design:type", Number)
], CreatePhysicalBookDto.prototype, "yearOfPublication", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El ID del autor debe ser una cadena de texto' }),
    __metadata("design:type", String)
], CreatePhysicalBookDto.prototype, "authorId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El nombre del autor debe ser una cadena de texto' }),
    (0, class_validator_1.MinLength)(2, { message: 'El nombre del autor debe tener mínimo 2 caracteres' }),
    __metadata("design:type", String)
], CreatePhysicalBookDto.prototype, "authorName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El ID de la categoría debe ser una cadena de texto' }),
    __metadata("design:type", String)
], CreatePhysicalBookDto.prototype, "categoryId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El nombre de la categoría debe ser una cadena de texto' }),
    (0, class_validator_1.MinLength)(2, { message: 'El género literario debe tener mínimo 2 caracteres' }),
    __metadata("design:type", String)
], CreatePhysicalBookDto.prototype, "categoryName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)({ message: 'Debes incluir un PNF' }),
    __metadata("design:type", String)
], CreatePhysicalBookDto.prototype, "pnf", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3, { message: 'La editorial debe tener un mínimo de 3 caracteres' }),
    (0, class_validator_1.IsDefined)({ message: 'Debes incluir una editorial' }),
    __metadata("design:type", String)
], CreatePhysicalBookDto.prototype, "editorial", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)({ message: 'El stock debe ser un número positivo' }),
    __metadata("design:type", Number)
], CreatePhysicalBookDto.prototype, "totalStock", void 0);
//# sourceMappingURL=create-physical-book.dto.js.map