import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BookExtractionResult } from './book-extraction.schema';
export declare class AiPhysicalBookService implements OnModuleInit {
    private configService;
    private modelWithStructuredOutput;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    processBookIntent(userInput: string, currentBookData?: any): Promise<BookExtractionResult>;
}
