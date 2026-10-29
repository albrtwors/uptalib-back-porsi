import { BadRequestException } from '@nestjs/common';

/**
 * Normaliza el nombre de un PNF para que "Informática", "INFORMATICA" y
 * " informatica " representen siempre el mismo registro.
 */
export function normalizePnfName(value: unknown): string {
  return `${value ?? ''}`
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

/**
 * Normaliza el valor del filtro de PNF de las listas. Los comodines que envían
 * los buscadores de la interfaz ('', 'TODOS', 'undefined', 'null') no filtran nada.
 */
export function normalizePnfFilter(value: unknown): string {
  const name = normalizePnfName(value);
  return !name || ['TODOS', 'UNDEFINED', 'NULL'].includes(name) ? '' : name;
}

/** Busca un PNF por nombre (case-insensitive) o lo crea si no existe. */
export async function ensurePnf(tx: any, value: unknown) {
  const name = normalizePnfName(value);
  if (!name) return null;

  const existing = await tx.pnf.findFirst({
    where: { name: { equals: name, mode: 'insensitive' } },
  });
  if (existing) return existing;

  try {
    return await tx.pnf.create({ data: { name } });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return tx.pnf.findFirst({
        where: { name: { equals: name, mode: 'insensitive' } },
      });
    }
    throw error;
  }
}

/**
 * Resuelve ids y nombres de PNF en una lista única de ids.
 * Los nombres inexistentes se crean (igual que autores y categorías).
 */
export async function resolvePnfIds(
  tx: any,
  ids: Array<string | null | undefined> = [],
  names: Array<string | null | undefined> = [],
): Promise<string[]> {
  const resolved: string[] = [];

  for (const id of ids) {
    const cleanId = `${id ?? ''}`.trim();
    if (!cleanId) continue;
    const pnf = await tx.pnf.findUnique({ where: { id: cleanId } });
    if (!pnf) throw new BadRequestException('Uno de los PNF seleccionados no existe');
    if (!resolved.includes(pnf.id)) resolved.push(pnf.id);
  }

  for (const value of names) {
    const pnf = await ensurePnf(tx, value);
    if (pnf && !resolved.includes(pnf.id)) resolved.push(pnf.id);
  }

  return resolved;
}
