import { Module } from '@nestjs/common';
import { BookService } from './books.service';
import { BookController } from './books.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { BulkBooksService } from './bulk-books/bulk-books.service';

@Module({
  imports: [PrismaModule],
  controllers: [BookController],
  exports: [BookService, BulkBooksService],
  providers: [BookService, BulkBooksService],
})
export class BooksModule { }