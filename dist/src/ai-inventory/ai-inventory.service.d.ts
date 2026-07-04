import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InventoryExtractionResult } from './inventory-extraction.schema';
export declare class AiInventoryService implements OnModuleInit {
    private configService;
    private modelWithStructuredOutput;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    processInventoryIntent(userInput: string, currentItemData?: any): Promise<InventoryExtractionResult>;
}
