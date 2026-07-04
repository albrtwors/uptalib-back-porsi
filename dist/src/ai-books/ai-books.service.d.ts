import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { BulkBookActionResult } from './book-extraction.schema';
export declare class AiBooksService implements OnModuleInit {
    private configService;
    private prisma;
    private modelWithStructuredOutput;
    private bulkModelWithStructuredOutput;
    constructor(configService: ConfigService, prisma: PrismaService);
    onModuleInit(): void;
    processBookIntent(userInput: string, currentBookData?: any): Promise<any>;
    processBulkIntent(userInput: string): Promise<BulkBookActionResult>;
}
