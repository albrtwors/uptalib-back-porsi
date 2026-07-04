import { Controller, Post, Body, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { AiPhysicalBookService } from './ai-physical-book.service';
import { BookExtractionResult } from './book-extraction.schema';

@Controller('ai-books')
export class AiPhysicalBookController {
  constructor(private readonly aiBookService: AiPhysicalBookService) { }

  @Post('process-intent')
  @HttpCode(HttpStatus.OK)
  async processIntent(
    @Body() body: { userInput: string; currentBookData?: any }
  ): Promise<BookExtractionResult> {
    const { userInput, currentBookData } = body;

    if (!userInput || userInput.trim() === '') {
      throw new BadRequestException('El mensaje del usuario (userInput) es obligatorio.');
    }

    return await this.aiBookService.processBookIntent(userInput, currentBookData);
  }
}