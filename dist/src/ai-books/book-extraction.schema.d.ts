import { z } from 'zod';
export declare const BookExtractionSchema: z.ZodObject<{
    message: z.ZodString;
    extractedData: z.ZodObject<{
        title: z.ZodNullable<z.ZodString>;
        description: z.ZodNullable<z.ZodString>;
        routepdf: z.ZodNullable<z.ZodString>;
        routeimg: z.ZodNullable<z.ZodString>;
        pnfs: z.ZodEffects<z.ZodArray<z.ZodEnum<["GENERAL", "INFORMATICA", "ELECTRONICA", "MANTENIMIENTO", "CONTADURIA", "ADMINISTRACION", "ELECTRICIDAD", "MECANICA", "INSTRUMENTACION", "TELECOMUNICACIONES"]>, "many">, ("GENERAL" | "INFORMATICA" | "ELECTRONICA" | "MANTENIMIENTO" | "CONTADURIA" | "ADMINISTRACION" | "ELECTRICIDAD" | "MECANICA" | "INSTRUMENTACION" | "TELECOMUNICACIONES")[], unknown>;
        authors: z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], unknown>;
    }, "strip", z.ZodTypeAny, {
        title?: string;
        description?: string;
        routepdf?: string;
        routeimg?: string;
        pnfs?: ("GENERAL" | "INFORMATICA" | "ELECTRONICA" | "MANTENIMIENTO" | "CONTADURIA" | "ADMINISTRACION" | "ELECTRICIDAD" | "MECANICA" | "INSTRUMENTACION" | "TELECOMUNICACIONES")[];
        authors?: string[];
    }, {
        title?: string;
        description?: string;
        routepdf?: string;
        routeimg?: string;
        pnfs?: unknown;
        authors?: unknown;
    }>;
}, "strip", z.ZodTypeAny, {
    message?: string;
    extractedData?: {
        title?: string;
        description?: string;
        routepdf?: string;
        routeimg?: string;
        pnfs?: ("GENERAL" | "INFORMATICA" | "ELECTRONICA" | "MANTENIMIENTO" | "CONTADURIA" | "ADMINISTRACION" | "ELECTRICIDAD" | "MECANICA" | "INSTRUMENTACION" | "TELECOMUNICACIONES")[];
        authors?: string[];
    };
}, {
    message?: string;
    extractedData?: {
        title?: string;
        description?: string;
        routepdf?: string;
        routeimg?: string;
        pnfs?: unknown;
        authors?: unknown;
    };
}>;
export declare const BulkBookActionSchema: z.ZodObject<{
    message: z.ZodString;
    extractedData: z.ZodArray<z.ZodObject<{
        action: z.ZodEnum<["CREATE", "UPDATE", "DELETE"]>;
        searchLookup: z.ZodNullable<z.ZodString>;
        title: z.ZodNullable<z.ZodString>;
        description: z.ZodNullable<z.ZodString>;
        routepdf: z.ZodNullable<z.ZodString>;
        routeimg: z.ZodNullable<z.ZodString>;
        pnfs: z.ZodEffects<z.ZodArray<z.ZodEnum<["GENERAL", "INFORMATICA", "ELECTRONICA", "MANTENIMIENTO", "CONTADURIA", "ADMINISTRACION", "ELECTRICIDAD", "MECANICA", "INSTRUMENTACION", "TELECOMUNICACIONES"]>, "many">, ("GENERAL" | "INFORMATICA" | "ELECTRONICA" | "MANTENIMIENTO" | "CONTADURIA" | "ADMINISTRACION" | "ELECTRICIDAD" | "MECANICA" | "INSTRUMENTACION" | "TELECOMUNICACIONES")[], unknown>;
        authors: z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], unknown>;
    }, "strip", z.ZodTypeAny, {
        title?: string;
        description?: string;
        routepdf?: string;
        routeimg?: string;
        pnfs?: ("GENERAL" | "INFORMATICA" | "ELECTRONICA" | "MANTENIMIENTO" | "CONTADURIA" | "ADMINISTRACION" | "ELECTRICIDAD" | "MECANICA" | "INSTRUMENTACION" | "TELECOMUNICACIONES")[];
        authors?: string[];
        action?: "CREATE" | "UPDATE" | "DELETE";
        searchLookup?: string;
    }, {
        title?: string;
        description?: string;
        routepdf?: string;
        routeimg?: string;
        pnfs?: unknown;
        authors?: unknown;
        action?: "CREATE" | "UPDATE" | "DELETE";
        searchLookup?: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    message?: string;
    extractedData?: {
        title?: string;
        description?: string;
        routepdf?: string;
        routeimg?: string;
        pnfs?: ("GENERAL" | "INFORMATICA" | "ELECTRONICA" | "MANTENIMIENTO" | "CONTADURIA" | "ADMINISTRACION" | "ELECTRICIDAD" | "MECANICA" | "INSTRUMENTACION" | "TELECOMUNICACIONES")[];
        authors?: string[];
        action?: "CREATE" | "UPDATE" | "DELETE";
        searchLookup?: string;
    }[];
}, {
    message?: string;
    extractedData?: {
        title?: string;
        description?: string;
        routepdf?: string;
        routeimg?: string;
        pnfs?: unknown;
        authors?: unknown;
        action?: "CREATE" | "UPDATE" | "DELETE";
        searchLookup?: string;
    }[];
}>;
export type BookExtractionResult = z.infer<typeof BookExtractionSchema>;
export type BulkBookActionResult = z.infer<typeof BulkBookActionSchema>;
