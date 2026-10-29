import { z } from 'zod';
import { normalizePnfName } from '../utils/pnf';

const PNF_LIST = z.preprocess(
    (val) => (val === null || val === undefined ? [] : Array.isArray(val) ? val.map((item: any) => normalizePnfName(typeof item === 'string' ? item : item?.name ?? item?.pnf ?? '')).filter(Boolean) : val),
    z.array(z.string().min(3).describe('El Programa Nacional de Formación asociado.'))
);

export const BookExtractionSchema = z.object({
    message: z.string().describe('Un mensaje amigable indicando qué campos se procesaron o modificaron.'),
    extractedData: z.object({
        title: z.string().nullable().describe('El título del libro extraído de la solicitud.'),
        isbn: z.string().nullable().describe('El código ISBN del libro (identificador editorial internacional).'),
        code: z.string().nullable().describe('El código asignado por la biblioteca al libro físico (base de los códigos de los ejemplares).'),
        authorName: z.string().nullable().describe('El nombre completo del autor del libro.'),
        categoryName: z.string().nullable().describe('La categoría, género o materia del libro.'),
        pnfs: PNF_LIST.describe('Lista de PNFs asociados al libro. Si no hay ninguno, devolver array vacío [].'),
        yearOfPublication: z.string().nullable().describe('El año de publicación del libro devuelto como un string numérico.'),
        editorial: z.string().nullable().describe('El nombre de la editorial.'),
        totalStock: z.string().nullable().describe('La cantidad total de libros físicos disponibles.')
    })
});

export type BookExtractionResult = z.infer<typeof BookExtractionSchema>;
