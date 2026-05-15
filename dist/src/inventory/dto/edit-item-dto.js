"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditItemInventory = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_inventory_dto_1 = require("./create-inventory.dto");
class EditItemInventory extends (0, swagger_1.PartialType)(create_inventory_dto_1.CreateInventoryDto) {
}
exports.EditItemInventory = EditItemInventory;
//# sourceMappingURL=edit-item-dto.js.map