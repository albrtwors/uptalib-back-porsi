import { z } from 'zod';

export const InventoryExtractionSchema = z.object({
    message: z.string().describe('Un mensaje amigable detallando qué características del item se lograron identificar.'),
    extractedData: z.object({
        name: z.string().nullable().describe('El nombre del objeto o equipo de inventario.'),
        code: z.string().nullable().describe('El código interno de identificación o serial del item si se menciona.'),
        description: z.string().nullable().describe('Una descripción breve sobre el estado físico, marca o uso del item.'),
        stock: z.string().nullable().describe('La cantidad numérica total disponible para el registro.'),
        typeName: z.string().nullable().describe('La categoría o tipo de item (ej. Computación, Mobiliario, Audiovisuales).')
    })
});

export type InventoryExtractionResult = z.infer<typeof InventoryExtractionSchema>;