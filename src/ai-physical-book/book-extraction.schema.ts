import { z } from 'zod';

export const BookExtractionSchema = z.object({
    message: z.string().describe('Un mensaje amigable indicando qué campos se procesaron o modificaron.'),
    extractedData: z.object({
        title: z.string().nullable().describe('El título del libro extraído de la solicitud.'),
        isbn: z.string().nullable().describe('El código ISBN del libro.'),
        authorName: z.string().nullable().describe('El nombre completo del autor del libro.'),
        categoryName: z.string().nullable().describe('La categoría, género o materia del libro.'),
        pnf: z.string().nullable().describe('El Programa Nacional de Formación asociado (ej. Informática, Mecánica, etc.).'),
        yearOfPublication: z.string().nullable().describe('El año de publicación del libro devuelto como un string numérico.'),
        editorial: z.string().nullable().describe('El nombre de la editorial.'),
        totalStock: z.string().nullable().describe('La cantidad total de libros físicos disponibles.')
    })
});

export type BookExtractionResult = z.infer<typeof BookExtractionSchema>;