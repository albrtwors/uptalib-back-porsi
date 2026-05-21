import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as zlib from 'zlib';

@Injectable()
export class BackupService {
    constructor(private prisma: PrismaService) { }

    async generateBackup() {
        const backup = {
            generatedAt: new Date().toISOString(),

            _prisma_migrations:
                await this.prisma.$queryRawUnsafe(
                    `SELECT * FROM "_prisma_migrations"`
                ),

            Author: await this.prisma.author.findMany(),

            Book: await this.prisma.book.findMany(),

            BookOperation:
                await this.prisma.bookOperation.findMany(),

            Category:
                await this.prisma.category.findMany(),

            Item:
                await this.prisma.item.findMany(),

            ItemOperation:
                await this.prisma.itemOperation.findMany(),

            ItemType:
                await this.prisma.itemType.findMany(),

            Operation:
                await this.prisma.operation.findMany(),

            PhysicalBook:
                await this.prisma.physicalBook.findMany(),

            SavedBook:
                await this.prisma.savedBook.findMany(),

            User:
                await this.prisma.user.findMany(),
        };

        const json = JSON.stringify(backup, null, 2);

        const gzipped = zlib.gzipSync(json);

        return gzipped;
    }
}