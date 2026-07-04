import { AiInventoryService } from './ai-inventory.service';
import { InventoryExtractionResult } from './inventory-extraction.schema';
export declare class AiInventoryController {
    private readonly aiInventoryService;
    constructor(aiInventoryService: AiInventoryService);
    handleInventoryIntent(message: string, currentItem?: any): Promise<InventoryExtractionResult>;
}
