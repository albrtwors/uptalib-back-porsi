import { Module } from '@nestjs/common';
import { AiBooksService } from './ai-books.service';
import { AiBooksController } from './ai-books.controller';
import { ConfigModule } from '@nestjs/config'
import { BulkBooksService } from "../books/bulk-books/bulk-books.service"
import { BookService } from "../books/books.service"
@Module({
  controllers: [AiBooksController],
  providers: [AiBooksService, BulkBooksService, BookService],
  imports: [
    ConfigModule, // 💡 Esto le da acceso a AiBooksService al ConfigService e introduce las variables de entorno (.env)
  ],
})
export class AiBooksModule { }
