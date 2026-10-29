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
  pnf: ['name'],
  physicalBook: [
    'code',
    'isbn',
    'title',
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

  private static readonly RETRYABLE_CODES = new Set([
    'P1000',
    'P1001',
    'P1002',
    'P1008',
    'P1017',
    'P2024',
  ]);

  private static readonly RETRYABLE_PATTERN =
    /connection|closed the connection|timed out fetching|login has been failing|econnreset|etimedout|econnrefused|socket hang up|server conn/i;

  private isTransient(err: unknown): boolean {
    const error = err as { code?: string; message?: string } | null;
    if (!error) return false;
    if (error.code && SyncService.RETRYABLE_CODES.has(error.code)) return true;
    return SyncService.RETRYABLE_PATTERN.test(String(error.message ?? ''));
  }

  /**
   * Reintenta ante errores transitorios de conexión con Postgres. En Vercel el
   * pool de Prisma queda con conexiones obsoletas tras el idle y la primera
   * petición falla; reintentar descarta la conexión muerta y abre una nueva.
   */
  private async withRetry<T>(
    label: string,
    operation: () => Promise<T>,
    attempts = 3,
  ): Promise<T> {
    let lastError: unknown;
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      try {
        return await operation();
      } catch (err) {
        lastError = err;
        if (attempt === attempts || !this.isTransient(err)) throw err;
        const delay = 500 * attempt;
        this.logger.warn(
          `${label}: transient DB error (attempt ${attempt}/${attempts}), retrying in ${delay}ms`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    throw lastError;
  }

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
    return this.withRetry('exportAll', () => this.buildSnapshot());
  }

  private async buildSnapshot() {
    const [
      categories,
      authors,
      itemTypes,
      physicalBooks,
      pnfs,
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
        include: {
          authors: { select: { id: true } },
          categories: { select: { id: true } },
          pnfs: { select: { id: true } },
        },
      }),
      this.prisma.pnf.findMany(),
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
          pnfIds: b.pnfs.map((p) => p.id),
          authors: undefined,
          categories: undefined,
          pnfs: undefined,
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
    return this.withRetry('merge', () => this.runMerge(payload));
  }

  private async runMerge(payload: any) {
    const data = payload?.data ?? {};
    const counters: SyncCounters = { created: 0, updated: 0, skipped: 0 };

    await this.prisma.$transaction(
      async (tx) => {
        await this.upsertScalars(tx, 'category', data.categories ?? [], counters);
        await this.upsertScalars(tx, 'author', data.authors ?? [], counters);
        await this.upsertScalars(tx, 'itemType', data.itemTypes ?? [], counters);
        await this.upsertScalars(tx, 'pnf', data.pnfs ?? [], counters);

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
          const incomingPnfIds = Array.isArray(row.pnfIds)
            ? row.pnfIds.filter((id: any) => typeof id === 'string')
            : [];

          if (!existing) {
            await tx.physicalBook.create({ data: base as any });
            counters.created += 1;
            if (incomingPnfIds.length > 0) {
              await tx.physicalBook.update({
                where: { id: row.id },
                data: { pnfs: { set: incomingPnfIds.map((id: string) => ({ id })) } },
              });
            }
          } else if (this.isNewer(row, existing)) {
            await tx.physicalBook.update({ where: { id: row.id }, data: this.pick('physicalBook', row, false) });
            counters.updated += 1;
            if (incomingPnfIds.length > 0) {
              await tx.physicalBook.update({
                where: { id: row.id },
                data: { pnfs: { set: incomingPnfIds.map((id: string) => ({ id })) } },
              });
            }
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
    return this.withRetry('info', () => this.buildInfo());
  }

  private async buildInfo() {
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
