import { z } from 'zod';

const PNF_ENUM = z.enum([
    "GENERAL", "INFORMATICA", "ELECTRONICA", "MANTENIMIENTO",
    "CONTADURIA", "ADMINISTRACION", "ELECTRICIDAD",
    "MECANICA", "INSTRUMENTACION", "TELECOMUNICACIONES"
]);

export const BookExtractionSchema = z.object({
    message: z.string().describe("Respuesta conversacional amigable para el usuario."),
    extractedData: z.object({
        // 💡 .nullable() permite recibir null de la IA sin que falle el parseo
        title: z.string().nullable().describe("El título del libro si se menciona. Si no, null."),
        description: z.string().nullable().describe("Resumen del libro si se menciona. Si no, null."),
        routepdf: z.string().nullable().describe("La URL o ruta del PDF si se menciona. Si no, null."),
        routeimg: z.string().nullable().describe("La URL o ruta de la portada si se menciona. Si no, null."),

        // 💡 Preprocesador blindado: Si viene null o vacío, lo transforma en un array válido []
        pnfs: z.preprocess(
            (val) => (val === null || val === undefined ? [] : val),
            z.array(PNF_ENUM)
        ).describe("Lista de PNFs válidos."),

        authors: z.preprocess(
            (val) => (val === null || val === undefined ? [] : val),
            z.array(z.string())
        ).describe("Lista con los nombres de los autores mencionados.")
    })
});

export const BulkBookActionSchema = z.object({
    message: z.string().describe("Respuesta inicial indicando el plan de ejecución por lote detectado."),
    // 💡 Dejamos el z.array directo y limpio. Groq no se confundirá con objetos ni sub-propiedades 'items'.
    extractedData: z.array(
        z.object({
            action: z.enum(['CREATE', 'UPDATE', 'DELETE']).describe("La acción a ejecutar sobre este libro específico."),
            searchLookup: z.string().nullable().describe("Criterio de búsqueda (título exacto o aproximado) requerido para UPDATE o DELETE."),
            title: z.string().nullable().describe("Título del libro (Obligatorio para CREATE)."),
            description: z.string().nullable().describe("Descripción del libro."),
            routepdf: z.string().nullable().describe("Ruta del archivo PDF."),
            routeimg: z.string().nullable().describe("Ruta de la imagen de portada."),

            // Blindamos los sub-arreglos internos de cada operación
            pnfs: z.preprocess(
                (val) => (val === null || val === undefined ? [] : val),
                z.array(PNF_ENUM)
            ).describe("Lista de PNFs asociados al libro. Si no hay ninguno, devolver array vacío []."),

            authors: z.preprocess(
                (val) => (val === null || val === undefined ? [] : val),
                z.array(z.string())
            ).describe("Lista de nombres de los autores del libro. Si no hay ninguno, devolver array vacío [].")
        })
    ).describe("Arreglo con la lista de acciones a ejecutar. Debe ser una lista directa de objetos.")
});

export type BookExtractionResult = z.infer<typeof BookExtractionSchema>;
export type BulkBookActionResult = z.infer<typeof BulkBookActionSchema>;