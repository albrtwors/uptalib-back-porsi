import { z } from 'zod';
export declare const BookExtractionSchema: z.ZodObject<{
    message: z.ZodString;
    extractedData: z.ZodObject<{
        title: z.ZodNullable<z.ZodString>;
        isbn: z.ZodNullable<z.ZodString>;
        authorName: z.ZodNullable<z.ZodString>;
        categoryName: z.ZodNullable<z.ZodString>;
        pnf: z.ZodNullable<z.ZodString>;
        yearOfPublication: z.ZodNullable<z.ZodString>;
        editorial: z.ZodNullable<z.ZodString>;
        totalStock: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        title?: string;
        pnf?: string;
        totalStock?: string;
        isbn?: string;
        yearOfPublication?: string;
        authorName?: string;
        categoryName?: string;
        editorial?: string;
    }, {
        title?: string;
        pnf?: string;
        totalStock?: string;
        isbn?: string;
        yearOfPublication?: string;
        authorName?: string;
        categoryName?: string;
        editorial?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    message?: string;
    extractedData?: {
        title?: string;
        pnf?: string;
        totalStock?: string;
        isbn?: string;
        yearOfPublication?: string;
        authorName?: string;
        categoryName?: string;
        editorial?: string;
    };
}, {
    message?: string;
    extractedData?: {
        title?: string;
        pnf?: string;
        totalStock?: string;
        isbn?: string;
        yearOfPublication?: string;
        authorName?: string;
        categoryName?: string;
        editorial?: string;
    };
}>;
export type BookExtractionResult = z.infer<typeof BookExtractionSchema>;
