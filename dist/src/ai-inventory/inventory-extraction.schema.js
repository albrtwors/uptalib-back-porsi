"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryExtractionSchema = void 0;
const zod_1 = require("zod");
exports.InventoryExtractionSchema = zod_1.z.object({
    message: zod_1.z.string().describe('Un mensaje amigable detallando qué características del item se lograron identificar.'),
    extractedData: zod_1.z.object({
        name: zod_1.z.string().nullable().describe('El nombre del objeto o equipo de inventario.'),
        code: zod_1.z.string().nullable().describe('El código interno de identificación o serial del item si se menciona.'),
        description: zod_1.z.string().nullable().describe('Una descripción breve sobre el estado físico, marca o uso del item.'),
        stock: zod_1.z.string().nullable().describe('La cantidad numérica total disponible para el registro.'),
        typeName: zod_1.z.string().nullable().describe('La categoría o tipo de item (ej. Computación, Mobiliario, Audiovisuales).')
    })
});
//# sourceMappingURL=inventory-extraction.schema.js.map