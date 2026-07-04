"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkBookActionSchema = exports.BookExtractionSchema = void 0;
const zod_1 = require("zod");
const PNF_ENUM = zod_1.z.enum([
    "GENERAL", "INFORMATICA", "ELECTRONICA", "MANTENIMIENTO",
    "CONTADURIA", "ADMINISTRACION", "ELECTRICIDAD",
    "MECANICA", "INSTRUMENTACION", "TELECOMUNICACIONES"
]);
exports.BookExtractionSchema = zod_1.z.object({
    message: zod_1.z.string().describe("Respuesta conversacional amigable para el usuario."),
    extractedData: zod_1.z.object({
        title: zod_1.z.string().nullable().describe("El título del libro si se menciona. Si no, null."),
        description: zod_1.z.string().nullable().describe("Resumen del libro si se menciona. Si no, null."),
        routepdf: zod_1.z.string().nullable().describe("La URL o ruta del PDF si se menciona. Si no, null."),
        routeimg: zod_1.z.string().nullable().describe("La URL o ruta de la portada si se menciona. Si no, null."),
        pnfs: zod_1.z.preprocess((val) => (val === null || val === undefined ? [] : val), zod_1.z.array(PNF_ENUM)).describe("Lista de PNFs válidos."),
        authors: zod_1.z.preprocess((val) => (val === null || val === undefined ? [] : val), zod_1.z.array(zod_1.z.string())).describe("Lista con los nombres de los autores mencionados.")
    })
});
exports.BulkBookActionSchema = zod_1.z.object({
    message: zod_1.z.string().describe("Respuesta inicial indicando el plan de ejecución por lote detectado."),
    extractedData: zod_1.z.array(zod_1.z.object({
        action: zod_1.z.enum(['CREATE', 'UPDATE', 'DELETE']).describe("La acción a ejecutar sobre este libro específico."),
        searchLookup: zod_1.z.string().nullable().describe("Criterio de búsqueda (título exacto o aproximado) requerido para UPDATE o DELETE."),
        title: zod_1.z.string().nullable().describe("Título del libro (Obligatorio para CREATE)."),
        description: zod_1.z.string().nullable().describe("Descripción del libro."),
        routepdf: zod_1.z.string().nullable().describe("Ruta del archivo PDF."),
        routeimg: zod_1.z.string().nullable().describe("Ruta de la imagen de portada."),
        pnfs: zod_1.z.preprocess((val) => (val === null || val === undefined ? [] : val), zod_1.z.array(PNF_ENUM)).describe("Lista de PNFs asociados al libro. Si no hay ninguno, devolver array vacío []."),
        authors: zod_1.z.preprocess((val) => (val === null || val === undefined ? [] : val), zod_1.z.array(zod_1.z.string())).describe("Lista de nombres de los autores del libro. Si no hay ninguno, devolver array vacío [].")
    })).describe("Arreglo con la lista de acciones a ejecutar. Debe ser una lista directa de objetos.")
});
//# sourceMappingURL=book-extraction.schema.js.map