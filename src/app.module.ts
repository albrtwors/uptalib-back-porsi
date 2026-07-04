import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';
import { BooksModule } from './books/books.module';
import { InventoryModule } from './inventory/inventory.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path'
import { MulterModule } from '@nestjs/platform-express';
import { PhysicalBooksModule } from './physical-books/physical-books.module';
import { CategoryModule } from './category/category.module';
import { AuthorModule } from './author/author.module';
import { PhysicalBookOperationModule } from './physical-book-operation/physical-book-operation.module';
import { ItemTypeModule } from './item-type/item-type.module';
import { InventoryOperationModule } from './inventory-operation/inventory-operation.module';
import { LogsModule } from './logs/logs.module';
import { SupabaseService } from './supabase/supabase.service';
import { SupabaseModule } from './supabase/supabase.module';
import { FilesService } from './files/files.service';
import { BackupModule } from './backup/backup.module';
import { AiBooksModule } from './ai-books/ai-books.module';
import { AiInventoryModule } from './ai-inventory/ai-inventory.module';
import { AiPhysicalBookModule } from './ai-physical-book/ai-physical-book.module';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'), // Path to your local docs folder
      serveRoot: '/public', // Optional: Files will be available at http://localhost:3000/docs
    }),
    MulterModule.register({
      dest: '/public/uploads'
    }),

    PrismaModule,
    AuthModule,
    UsersModule,
    BooksModule,
    InventoryModule,
    PhysicalBooksModule,
    CategoryModule,
    AuthorModule,
    PhysicalBookOperationModule,
    ItemTypeModule,
    InventoryOperationModule,
    LogsModule,
    BackupModule,
    AiBooksModule,
    AiInventoryModule,
    AiPhysicalBookModule,

  ],
  providers: [],
})
export class AppModule { }
