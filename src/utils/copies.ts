import { CopyStatus } from '@prisma/client';

/**
 * Utilidades compartidas para el control de inventario por ejemplares (copias).
 * Un mismo archivo da soporte tanto a libros físicos (BookCopy) como a
 * artículos de inventario (ItemCopy), ya que comparten la misma semántica.
 */

export interface CopyCodeParentBook {
  id: string;
  isbn?: string | null;
}

export interface CopyCodeParentItem {
  id: string;
  code?: string | null;
}

function sanitize(seed: string): string {
  const clean = `${seed}`.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  return clean.slice(0, 8) || 'GEN';
}

/** Prefijo de código para ejemplares de un libro físico: LIB-<ISBN|id> */
export function bookCopyBase(book: CopyCodeParentBook): string {
  return `LIB-${sanitize(book.isbn && book.isbn.trim() ? book.isbn : book.id)}`;
}

/** Prefijo de código para ejemplares de un artículo: ART-<code|id> */
export function itemCopyBase(item: CopyCodeParentItem): string {
  return `ART-${sanitize(item.code && `${item.code}`.trim() ? item.code : item.id)}`;
}

function nextSequentialCode(base: string, used: Set<string>): string {
  let n = 1;
  for (const code of used) {
    if (code.startsWith(`${base}-`)) {
      const parsed = parseInt(code.slice(base.length + 1), 10);
      if (!Number.isNaN(parsed) && parsed >= n) n = parsed + 1;
    }
  }
  let candidate: string;
  do {
    candidate = `${base}-${String(n).padStart(4, '0')}`;
    n += 1;
  } while (used.has(candidate.toUpperCase()));
  return candidate;
}

function uniquify(requested: string, used: Set<string>): string {
  let candidate = requested.trim();
  if (!candidate) return candidate;
  let suffix = 1;
  while (used.has(candidate.toUpperCase())) {
    suffix += 1;
    candidate = `${requested.trim()}-${suffix}`;
  }
  return candidate;
}

/**
 * Construye la lista de códigos para un lote de ejemplares.
 * - Si el usuario envía `requestedCodes`, se respetan (con opción de edición).
 * - Los faltantes se autogeneran con el patrón `<base>-0001`.
 * Garantiza que no existan duplicados dentro del lote ni contra `existing`.
 */
export function buildCopyCodes(
  base: string,
  quantity: number,
  existing: Iterable<string> = [],
  requestedCodes: string[] = [],
): string[] {
  const used = new Set<string>([...existing].map((c) => c.toUpperCase()));
  const requested = (requestedCodes ?? []).map((c) => `${c}`.trim()).filter(Boolean);
  const codes: string[] = [];

  for (let i = 0; i < quantity; i += 1) {
    let code = requested[i];
    code = code ? uniquify(code, used) : nextSequentialCode(base, used);
    codes.push(code);
    used.add(code.toUpperCase());
  }

  return codes;
}

/**
 * Crea un lote de ejemplares (BookCopy) respetando códigos solicitados y
 * autogenerando los restantes. Devuelve las copias creadas.
 */
export async function createBookCopies(
  tx: any,
  book: CopyCodeParentBook,
  quantity: number,
  requestedCodes: string[] = [],
  extra: { location?: string | null; observations?: string | null } = {},
) {
  if (quantity <= 0) return [];

  const existing = await tx.bookCopy.findMany({
    where: { bookId: book.id },
    select: { code: true },
  });

  const codes = buildCopyCodes(
    bookCopyBase(book),
    quantity,
    existing.map((c: any) => c.code),
    requestedCodes,
  );

  const created = [];
  for (const code of codes) {
    created.push(
      await tx.bookCopy.create({
        data: {
          code,
          bookId: book.id,
          status: CopyStatus.DISPONIBLE,
          location: extra.location ?? null,
          observations: extra.observations ?? null,
        },
      }),
    );
  }
  return created;
}

/**
 * Crea un lote de ejemplares (ItemCopy) respetando códigos solicitados y
 * autogenerando los restantes. Devuelve las copias creadas.
 */
export async function createItemCopies(
  tx: any,
  item: CopyCodeParentItem,
  quantity: number,
  requestedCodes: string[] = [],
  extra: { location?: string | null; observations?: string | null } = {},
) {
  if (quantity <= 0) return [];

  const existing = await tx.itemCopy.findMany({
    where: { itemId: item.id },
    select: { code: true },
  });

  const codes = buildCopyCodes(
    itemCopyBase(item),
    quantity,
    existing.map((c: any) => c.code),
    requestedCodes,
  );

  const created = [];
  for (const code of codes) {
    created.push(
      await tx.itemCopy.create({
        data: {
          code,
          itemId: item.id,
          status: CopyStatus.DISPONIBLE,
          location: extra.location ?? null,
          observations: extra.observations ?? null,
        },
      }),
    );
  }
  return created;
}

export interface StockSummary {
  total: number;
  available: number;
  loaned: number;
  maintenance: number;
}

function summarize(copies: { status: CopyStatus }[]): StockSummary {
  const summary: StockSummary = { total: 0, available: 0, loaned: 0, maintenance: 0 };
  for (const copy of copies) {
    if (copy.status === CopyStatus.BAJA) continue;
    summary.total += 1;
    if (copy.status === CopyStatus.DISPONIBLE) summary.available += 1;
    else if (copy.status === CopyStatus.PRESTADO) summary.loaned += 1;
    else if (copy.status === CopyStatus.MANTENIMIENTO) summary.maintenance += 1;
  }
  return summary;
}

/** Recalcula el stock derivado de un libro físico a partir de sus ejemplares. */
export async function recalcBookStock(tx: any, bookId: string): Promise<StockSummary & { status: string }> {
  const copies = await tx.bookCopy.findMany({ where: { bookId }, select: { status: true } });
  const summary = summarize(copies);

  const status =
    summary.available > 0
      ? 'DISPONIBLE'
      : summary.maintenance > 0 && summary.loaned === 0
        ? 'MANTENIMIENTO'
        : 'AGOTADO';

  await tx.physicalBook.update({
    where: { id: bookId },
    data: { totalStock: summary.total, availableStock: summary.available, status },
  });

  return { ...summary, status };
}

/** Recalcula el stock derivado de un artículo de inventario a partir de sus ejemplares. */
export async function recalcItemStock(tx: any, itemId: string): Promise<StockSummary & { status: string }> {
  const copies = await tx.itemCopy.findMany({ where: { itemId }, select: { status: true } });
  const summary = summarize(copies);

  const status =
    summary.available > 0
      ? 'DISPONIBLE'
      : summary.maintenance > 0 && summary.loaned === 0
        ? 'MANTENIMIENTO'
        : 'AGOTADO';

  await tx.item.update({
    where: { id: itemId },
    data: { totalStock: summary.total, availableStock: summary.available, status },
  });

  return { ...summary, status };
}
