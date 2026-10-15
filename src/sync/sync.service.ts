import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Sincronización híbrida offline-first (Electron ⇄ Backend).
 *
 * Estrategia: "última escritura gana" (last-write-wins) por `updatedAt`.
 * El servidor actúa como autoridad: recibe un snapshot del cliente, lo
 * fusiona por LWW y devuelve el snapshot canónico resultante. Los `id` son
 * globalmente únicos (uuid/cuid), por lo que no hay colisiones entre clientes.
 */

export interface SyncCounters {
  created: number;
  updated: number;
  skipped: number;
}

const SCALARS: Record<string, string[]> = {
  category: ['name'],
  author: ['name'],
  itemType: ['name'],
  physicalBook: [
    'isbn',
    'title',
    'pnf',
    'yearOfPublication',
    'editorial',
    'totalStock',
    'availableStock',
    'status',
  ],
  bookCopy: ['code', 'status', 'location', 'observations', 'bookId'],
  bookOperation: [
    'bookId',
    'copyId',
    'type',
    'quantity',
    'observations',
    'personId',
    'wasSettled',
    'personNames',
    'personSurNames',
  ],
  item: [
    'name',
    'code',
    'description',
    'totalStock',
    'availableStock',
    'typeId',
    'status',
  ],
  itemCopy: ['code', 'status', 'location', 'observations', 'itemId'],
  itemOperation: [
    'itemId',
    'copyId',
    'type',
    'quantity',
    'observations',
    'personId',
    'wasSettled',
    'personNames',
    'personSurNames',
  ],
};

@Injectable()
export class SyncService {
  private readonly logger = new Logger('SyncService');

  constructor(private readonly prisma: PrismaService) {}

  private isNewer(incoming: any, existing: any): boolean {
    if (!incoming || incoming.updatedAt === undefined || incoming.updatedAt === null) {
      return false;
    }
    const a = new Date(incoming.updatedAt).getTime();
    const b = new Date(existing?.updatedAt ?? 0).getTime();
    if (Number.isNaN(a)) return false;
    if (Number.isNaN(b)) return true;
    return a > b;
  }

  private pick(model: string, row: any, includeId = true): Record<string, unknown> {
    const fields = SCALARS[model] ?? [];
    const data: Record<string, unknown> = {};
    if (includeId && row.id !== undefined) data.id = row.id;
    for (const field of fields) {
      if (row[field] !== undefined) data[field] = row[field];
    }
    return data;
  }

  private async upsertScalars(
    tx: any,
    model: string,
    rows: any[],
    counters: SyncCounters,
  ): Promise<void> {
    for (const row of rows ?? []) {
      if (!row || typeof row.id !== 'string') continue;
      const existing = await tx[model].findUnique({ where: { id: row.id } });
      if (!existing) {
        await tx[model].create({ data: this.pick(model, row) });
        counters.created += 1;
      } else if (this.isNewer(row, existing)) {
        await tx[model].update({ where: { id: row.id }, data: this.pick(model, row, false) });
        counters.updated += 1;
      } else {
        counters.skipped += 1;
      }
    }
  }

  /** Devuelve el snapshot completo del servidor normalizado para sincronización. */
  async exportAll() {
    const [
      categories,
      authors,
      itemTypes,
      physicalBooks,
      bookCopies,
      bookOperations,
      items,
      itemCopies,
      itemOperations,
    ] = await Promise.all([
      this.prisma.category.findMany(),
      this.prisma.author.findMany(),
      this.prisma.itemType.findMany(),
      this.prisma.physicalBook.findMany({
        include: { authors: { select: { id: true } }, categories: { select: { id: true } } },
      }),
      this.prisma.bookCopy.findMany(),
      this.prisma.bookOperation.findMany(),
      this.prisma.item.findMany({
        include: { authors: { select: { id: true } }, categories: { select: { id: true } } },
      }),
      this.prisma.itemCopy.findMany(),
      this.prisma.itemOperation.findMany(),
    ]);

    return {
      serverTime: new Date().toISOString(),
      data: {
        categories,
        authors,
        itemTypes,
        physicalBooks: physicalBooks.map((b) => ({
          ...b,
          authorIds: b.authors.map((a) => a.id),
          categoryIds: b.categories.map((c) => c.id),
          authors: undefined,
          categories: undefined,
        })),
        bookCopies,
        bookOperations,
        items: items.map((i) => ({
          ...i,
          authorIds: i.authors.map((a) => a.id),
          categoryIds: i.categories.map((c) => c.id),
          authors: undefined,
          categories: undefined,
        })),
        itemCopies,
        itemOperations,
      },
    };
  }

  /** Fusiona el snapshot del cliente (LWW) y devuelve el estado canónico. */
  async merge(payload: any) {
    const data = payload?.data ?? {};
    const counters: SyncCounters = { created: 0, updated: 0, skipped: 0 };

    await this.prisma.$transaction(
      async (tx) => {
        await this.upsertScalars(tx, 'category', data.categories ?? [], counters);
        await this.upsertScalars(tx, 'author', data.authors ?? [], counters);
        await this.upsertScalars(tx, 'itemType', data.itemTypes ?? [], counters);

        const authorIds = new Set(
          (await tx.author.findMany({ select: { id: true } })).map((a: any) => a.id),
        );
        const categoryIds = new Set(
          (await tx.category.findMany({ select: { id: true } })).map((c: any) => c.id),
        );
        const itemTypeIds = new Set(
          (await tx.itemType.findMany({ select: { id: true } })).map((t: any) => t.id),
        );

        // PhysicalBooks (con relaciones autor/categoría)
        for (const row of data.physicalBooks ?? []) {
          if (!row || typeof row.id !== 'string') continue;
          const existing = await tx.physicalBook.findUnique({ where: { id: row.id } });
          const base = this.pick('physicalBook', row);
          if (!existing) {
            await tx.physicalBook.create({ data: base as any });
            counters.created += 1;
          } else if (this.isNewer(row, existing)) {
            await tx.physicalBook.update({ where: { id: row.id }, data: this.pick('physicalBook', row, false) });
            counters.updated += 1;
          } else {
            counters.skipped += 1;
            continue;
          }
          if (Array.isArray(row.authorIds)) {
            await tx.physicalBook.update({
              where: { id: row.id },
              data: {
                authors: {
                  set: row.authorIds
                    .filter((id: string) => authorIds.has(id))
                    .map((id: string) => ({ id })),
                },
              },
            });
          }
          if (Array.isArray(row.categoryIds)) {
            await tx.physicalBook.update({
              where: { id: row.id },
              data: {
                categories: {
                  set: row.categoryIds
                    .filter((id: string) => categoryIds.has(id))
                    .map((id: string) => ({ id })),
                },
              },
            });
          }
        }

        // Items
        for (const row of data.items ?? []) {
          if (!row || typeof row.id !== 'string') continue;
          if (row.typeId && !itemTypeIds.has(row.typeId)) {
            counters.skipped += 1;
            continue;
          }
          const existing = await tx.item.findUnique({ where: { id: row.id } });
          if (!existing) {
            await tx.item.create({ data: this.pick('item', row) as any });
            counters.created += 1;
          } else if (this.isNewer(row, existing)) {
            await tx.item.update({ where: { id: row.id }, data: this.pick('item', row, false) });
            counters.updated += 1;
          } else {
            counters.skipped += 1;
            continue;
          }
          if (Array.isArray(row.authorIds)) {
            await tx.item.update({
              where: { id: row.id },
              data: {
                authors: {
                  set: row.authorIds
                    .filter((id: string) => authorIds.has(id))
                    .map((id: string) => ({ id })),
                },
              },
            });
          }
          if (Array.isArray(row.categoryIds)) {
            await tx.item.update({
              where: { id: row.id },
              data: {
                categories: {
                  set: row.categoryIds
                    .filter((id: string) => categoryIds.has(id))
                    .map((id: string) => ({ id })),
                },
              },
            });
          }
        }

        // Copias
        await this.upsertScalars(tx, 'bookCopy', data.bookCopies ?? [], counters);
        await this.upsertScalars(tx, 'itemCopy', data.itemCopies ?? [], counters);
        // Operaciones
        await this.upsertScalars(tx, 'bookOperation', data.bookOperations ?? [], counters);
        await this.upsertScalars(tx, 'itemOperation', data.itemOperations ?? [], counters);
      },
      { timeout: 120000, maxWait: 20000 },
    );

    const snapshot = await this.exportAll();
    this.logger.log(
      `Sync merge -> created=${counters.created} updated=${counters.updated} skipped=${counters.skipped}`,
    );
    return { ...snapshot, summary: counters };
  }

  async info() {
    const [categories, authors, itemTypes, physicalBooks, items, bookCopies, itemCopies] =
      await Promise.all([
        this.prisma.category.count(),
        this.prisma.author.count(),
        this.prisma.itemType.count(),
        this.prisma.physicalBook.count(),
        this.prisma.item.count(),
        this.prisma.bookCopy.count(),
        this.prisma.itemCopy.count(),
      ]);
    return {
      serverTime: new Date().toISOString(),
      counts: {
        categories,
        authors,
        itemTypes,
        physicalBooks,
        items,
        bookCopies,
        itemCopies,
      },
    };
  }
}
