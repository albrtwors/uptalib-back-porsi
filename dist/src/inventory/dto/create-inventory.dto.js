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
exports.CreateInventoryDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CreateInventoryDto {
}
exports.CreateInventoryDto = CreateInventoryDto;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    (0, class_validator_1.IsInt)({ message: 'La cantidad debe ser un número entero' }),
    (0, class_validator_1.IsPositive)({ message: 'La cantidad debe ser un número positivo' }),
    __metadata("design:type", Number)
], CreateInventoryDto.prototype, "stock", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'El nombre debe ser texto' }),
    (0, class_validator_1.MaxLength)(20, { message: 'El nombre debe tener un máximo de 20 caracteres' }),
    (0, class_validator_1.MinLength)(3, { message: 'El nombre debe tener mínimo 3 caracteres' }),
    __metadata("design:type", String)
], CreateInventoryDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El ID del tipo debe ser una cadena de texto' }),
    __metadata("design:type", String)
], CreateInventoryDto.prototype, "typeId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El nombre del tipo debe ser texto' }),
    (0, class_validator_1.MinLength)(2, { message: 'El nombre del tipo debe tener mínimo 2 caracteres' }),
    __metadata("design:type", String)
], CreateInventoryDto.prototype, "typeName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'El código debe ser cadena de texto' }),
    __metadata("design:type", String)
], CreateInventoryDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'La descripción debe ser texto' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(200, { message: 'La descripción debe tener un máximo de 200 caracteres' }),
    __metadata("design:type", String)
], CreateInventoryDto.prototype, "description", void 0);
//# sourceMappingURL=create-inventory.dto.js.map