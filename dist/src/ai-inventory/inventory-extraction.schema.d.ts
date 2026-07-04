import { z } from 'zod';
export declare const InventoryExtractionSchema: z.ZodObject<{
    message: z.ZodString;
    extractedData: z.ZodObject<{
        name: z.ZodNullable<z.ZodString>;
        code: z.ZodNullable<z.ZodString>;
        description: z.ZodNullable<z.ZodString>;
        stock: z.ZodNullable<z.ZodString>;
        typeName: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name?: string;
        description?: string;
        code?: string;
        typeName?: string;
        stock?: string;
    }, {
        name?: string;
        description?: string;
        code?: string;
        typeName?: string;
        stock?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    message?: string;
    extractedData?: {
        name?: string;
        description?: string;
        code?: string;
        typeName?: string;
        stock?: string;
    };
}, {
    message?: string;
    extractedData?: {
        name?: string;
        description?: string;
        code?: string;
        typeName?: string;
        stock?: string;
    };
}>;
export type InventoryExtractionResult = z.infer<typeof InventoryExtractionSchema>;
