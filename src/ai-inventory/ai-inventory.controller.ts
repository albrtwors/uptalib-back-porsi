import { Controller, Post, Body } from '@nestjs/common';
import { AiInventoryService } from './ai-inventory.service';
import { InventoryExtractionResult } from './inventory-extraction.schema';

@Controller('ai-inventory')
export class AiInventoryController {
  constructor(private readonly aiInventoryService: AiInventoryService) { }

  @Post('chat')
  async handleInventoryIntent(
    @Body('message') message: string,
    @Body('currentItem') currentItem?: any, // Recibe el item actual si viene de la edición
  ): Promise<InventoryExtractionResult> {
    // Mandamos el texto libre del chat y el objeto actual al servicio de Groq
    return this.aiInventoryService.processInventoryIntent(message, currentItem);
  }
}