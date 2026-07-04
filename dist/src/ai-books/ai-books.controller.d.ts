import { AiBooksService } from './ai-books.service';
import { BulkBooksService } from '../books/bulk-books/bulk-books.service';
export declare class AiBooksController {
    private readonly aiBooksService;
    private readonly bulkBooksService;
    constructor(aiBooksService: AiBooksService, bulkBooksService: BulkBooksService);
    handleChatbotIntent(message: string, currentBookJson?: string, file?: Express.Multer.File): Promise<any>;
    handleBulkExecution(message: string, req: any, file?: Express.Multer.File): Promise<{
        aiAnalysis: string;
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
