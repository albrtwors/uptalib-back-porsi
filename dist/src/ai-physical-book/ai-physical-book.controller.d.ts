import { AiPhysicalBookService } from './ai-physical-book.service';
import { BookExtractionResult } from './book-extraction.schema';
export declare class AiPhysicalBookController {
    private readonly aiBookService;
    constructor(aiBookService: AiPhysicalBookService);
    processIntent(body: {
        userInput: string;
        currentBookData?: any;
    }): Promise<BookExtractionResult>;
}
