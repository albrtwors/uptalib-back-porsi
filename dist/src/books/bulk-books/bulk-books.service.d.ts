import { BookService } from '../books.service';
import { PrismaService } from '../../../prisma/prisma.service';
export declare class BulkBooksService {
    private readonly bookService;
    private readonly prisma;
    constructor(bookService: BookService, prisma: PrismaService);
    processBulkOperations(operations: any[], req: any): Promise<{
        message: string;
        summary: {
            created: number;
            updated: number;
            deleted: number;
            failed: number;
            errors: string[];
            successLog: string[];
        };
    }>;
}
