import { BadRequestException } from '@nestjs/common';
import { CopyStatus } from '@prisma/client';

/**
 * Utilidades compartidas para el control de inventario por ejemplares (copias).
 * Un mismo archivo da soporte tanto a libros físicos (BookCopy) como a
 * artículos de inventario (ItemCopy), ya que comparten la misma semántica.
 */

export interface CopyCodeParentBook {
  id: string;
  isbn?: string | null;
  code?: string | null;
}

export interface CopyCodeRange {
  from?: string | null;
  to?: string | null;
}

export interface CopyExtra {
  location?: string | null;
  observations?: string | null;
  codeFrom?: string | null;
  codeTo?: string | null;
}

export interface CopyCodeParentItem {
  id: string;
  code?: string | null;
}

function sanitize(seed: string): string {
  const clean = `${seed}`.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  return clean.slice(0, 8) || 'GEN';
}

/**
 * Prefijo de los ejemplares. Si el registro tiene código asignado por la
 * biblioteca se usa tal cual, sin transformarlo: así los ejemplares heredan el
 * código real del libro/artículo. Solo si no tiene código se generan a partir
 * del ISBN o del id.
 */
function copyBase(assignedCode: string | null | undefined, kind: string, fallbackSeed: string): string {
  const code = `${assignedCode ?? ''}`.trim();
  if (code) return code.toUpperCase().replace(/\s+/g, '-');
  return `${kind}-${sanitize(fallbackSeed)}`;
}

/** Prefijo de código para ejemplares de un libro físico: <código|LIB-ISBN|LIB-id> */
export function bookCopyBase(book: CopyCodeParentBook): string {
  return copyBase(book.code, 'LIB', `${book.isbn ?? ''}`.trim() || book.id);
}

/** Prefijo de código para ejemplares de un artículo: <código|ART-id> */
export function itemCopyBase(item: CopyCodeParentItem): string {
  return copyBase(item.code, 'ART', item.id);
}

/** Último número de una cadena de códigos, o 0 si ninguno termina en número. */
function highestSequence(base: string, used: Set<string>): { next: number; width: number } {
  const escaped = base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const sameBase = new RegExp(`^${escaped}-(\\d+)$`);
  const anyTrailingNumber = /(\d+)$/;
  let highest = 0;
  let width = 4;
  for (const code of used) {
    if (code === base.toUpperCase()) continue;
    const match = sameBase.exec(code) ?? anyTrailingNumber.exec(code);
    if (!match) continue;
    const parsed = parseInt(match[1], 10);
    if (Number.isNaN(parsed) || parsed <= highest) continue;
    highest = parsed;
    width = Math.max(match[1].length, 2);
  }
  return { next: highest + 1, width };
}

/**
 * Genera el siguiente código consecutivo. El contador continúa el número más
 * alto ya existente para ese libro/artículo, aunque los ejemplares antiguos se
 * hayan creado con un prefijo distinto (por ejemplo tras cambiar el código).
 */
function nextSequentialCode(base: string, used: Set<string>): string {
  const { next, width } = highestSequence(base, used);
  let n = next;
  let candidate: string;
  do {
    candidate = `${base}-${String(n).padStart(width, '0')}`;
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

interface ParsedRangeBound {
  prefix: string;
  start: number;
  width: number;
}

function parseRangeBound(value: string): ParsedRangeBound {
  const trimmed = value.trim();
  const match = trimmed.match(/^(.*?)(\d+)$/);
  if (match) {
    return {
      prefix: match[1],
      start: parseInt(match[2], 10),
      width: match[2].length,
    };
  }
  const prefix = /[-_\s]$/.test(trimmed) ? trimmed : `${trimmed}-`;
  return { prefix, start: 1, width: 4 };
}

/**
 * Genera los códigos consecutivos de un rango. Ej:
 * from="LIB-ABC-0001", to="LIB-ABC-0010" -> 10 códigos.
 */
export function buildRangeCodes(range: CopyCodeRange, quantity: number): string[] {
  const from = `${range.from ?? ''}`.trim();
  const to = `${range.to ?? ''}`.trim();

  if (!from && !to) return [];
  if (!from) throw new BadRequestException('Debes indicar el código inicial del rango');
  if (quantity <= 0) return [];

  const startBound = parseRangeBound(from);
  let endNumber = startBound.start + quantity - 1;

  if (to) {
    const endBound = parseRangeBound(to);
    if (endBound.prefix !== startBound.prefix) {
      throw new BadRequestException('El código inicial y final del rango deben compartir el mismo prefijo');
    }
    if (endBound.start < startBound.start) {
      throw new BadRequestException('El código final del rango no puede ser menor que el inicial');
    }
    const capacity = endBound.start - startBound.start + 1;
    if (quantity > capacity) {
      throw new BadRequestException(`El rango indicado solo permite ${capacity} ejemplares`);
    }
    endNumber = endBound.start;
  }

  const codes: string[] = [];
  for (let n = startBound.start; n <= endNumber && codes.length < quantity; n += 1) {
    codes.push(`${startBound.prefix}${String(n).padStart(startBound.width, '0')}`);
  }
  return codes;
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
  range: CopyCodeRange = {},
): string[] {
  const used = new Set<string>([...existing].map((c) => c.toUpperCase()));
  const requested = (requestedCodes ?? []).map((c) => `${c}`.trim()).filter(Boolean);
  const rangeCodes = buildRangeCodes(range, quantity);
  const codes: string[] = [];

  for (let i = 0; i < quantity; i += 1) {
    let code = requested[i];
    if (!code && rangeCodes[i]) {
      code = rangeCodes[i];
      if (used.has(code.toUpperCase())) {
        throw new BadRequestException(`El código ${code} del rango ya existe`);
      }
    }
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
  extra: CopyExtra = {},
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
    { from: extra.codeFrom, to: extra.codeTo },
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
  extra: CopyExtra = {},
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
    { from: extra.codeFrom, to: extra.codeTo },
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
