"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookExtractionSchema = void 0;
const zod_1 = require("zod");
exports.BookExtractionSchema = zod_1.z.object({
    message: zod_1.z.string().describe('Un mensaje amigable indicando qué campos se procesaron o modificaron.'),
    extractedData: zod_1.z.object({
        title: zod_1.z.string().nullable().describe('El título del libro extraído de la solicitud.'),
        isbn: zod_1.z.string().nullable().describe('El código ISBN del libro.'),
        authorName: zod_1.z.string().nullable().describe('El nombre completo del autor del libro.'),
        categoryName: zod_1.z.string().nullable().describe('La categoría, género o materia del libro.'),
        pnf: zod_1.z.string().nullable().describe('El Programa Nacional de Formación asociado (ej. Informática, Mecánica, etc.).'),
        yearOfPublication: zod_1.z.string().nullable().describe('El año de publicación del libro devuelto como un string numérico.'),
        editorial: zod_1.z.string().nullable().describe('El nombre de la editorial.'),
        totalStock: zod_1.z.string().nullable().describe('La cantidad total de libros físicos disponibles.')
    })
});
//# sourceMappingURL=book-extraction.schema.js.map