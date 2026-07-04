import { Controller, Post, Body, UploadedFile, UseInterceptors, Req, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AiBooksService } from './ai-books.service';
import { BulkBooksService } from '../books/bulk-books/bulk-books.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('ai-books')
export class AiBooksController {
  constructor(
    private readonly aiBooksService: AiBooksService,
    private readonly bulkBooksService: BulkBooksService
  ) { }

  @Post('chat')
  @UseInterceptors(FileInterceptor('file'))
  async handleChatbotIntent(
    @Body('message') message: string,
    @Body('currentBook') currentBookJson?: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let contextInput = message || '';
    const currentBook = currentBookJson ? JSON.parse(currentBookJson) : undefined;

    if (file) {
      contextInput += `\n[Archivo adjunto detectado: "${file.originalname}"].`;
    }

    return this.aiBooksService.processBookIntent(contextInput, currentBook);
  }

  @Post('bulk-execute')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  async handleBulkExecution(
    @Body('message') message: string,
    @Req() req: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let contextInput = message || '';
    if (file) contextInput += `\n[Archivo adjunto detectado: "${file.originalname}"].`;

    const aiResult = await this.aiBooksService.processBulkIntent(contextInput);
    const executionResult = await this.bulkBooksService.processBulkOperations(aiResult.extractedData, req);

    return {
      ...executionResult,
      aiAnalysis: aiResult.message
    };
  }
}