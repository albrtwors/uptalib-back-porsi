import { CopyStatus } from '@prisma/client';
import { applyCopyStatus, CAN_DROP, CAN_ENTER, recalcBookStock } from './copies';

interface FakeCopy {
  id: string;
  code: string;
  status: CopyStatus;
  bookId?: string;
  itemId?: string;
}

function makeTx(copies: FakeCopy[]) {
  const updates: { id: string; status: CopyStatus }[] = [];
  const parentWrites: any[] = [];
  const table = (fk: 'bookId' | 'itemId', model: string) => ({
    findMany: (args: any) => {
      const ids: string[] | undefined = args.where.id?.in;
      const scoped = ids ? copies.filter((c) => ids.includes(c.id)) : copies.filter((c) => c[fk] === args.where[fk]);
      // El select debe traer la clave foránea o la validación de pertenencia falla
      const rows = scoped.map((c) =>
        Object.fromEntries(Object.entries(c).filter(([k]) => args.select[k])),
      );
      return Promise.resolve(rows);
    },
    update: ({ where, data }: any) => {
      updates.push({ id: where.id, status: data.status });
      const copy = copies.find((c) => c.id === where.id);
      copy.status = data.status;
      return Promise.resolve({ ...copy });
    },
    model,
  });
  return {
    bookCopy: table('bookId', 'bookCopy'),
    itemCopy: table('itemId', 'itemCopy'),
    physicalBook: { update: ({ data }: any) => (parentWrites.push(data), Promise.resolve({})) },
    item: { update: ({ data }: any) => (parentWrites.push(data), Promise.resolve({})) },
    updates,
    parentWrites,
  };
}

const bookCopies = (): FakeCopy[] => [
  { id: 'c1', code: 'BK-0001', status: CopyStatus.DISPONIBLE, bookId: 'b1' },
  { id: 'c2', code: 'BK-0002', status: CopyStatus.MANTENIMIENTO, bookId: 'b1' },
  { id: 'c3', code: 'BK-0003', status: CopyStatus.BAJA, bookId: 'b1' },
  { id: 'c4', code: 'BK-0004', status: CopyStatus.PRESTADO, bookId: 'b1' },
  { id: 'x1', code: 'BK-9999', status: CopyStatus.DISPONIBLE, bookId: 'b2' },
];

describe('applyCopyStatus', () => {
  it('retira los ejemplares seleccionados y recalcula el stock', async () => {
    const tx = makeTx(bookCopies());
    const updated = await applyCopyStatus(tx as any, 'book', 'b1', ['c1', 'c2'], CopyStatus.BAJA, CAN_DROP);
    expect(updated.map((c: any) => c.id)).toEqual(['c1', 'c2']);
    expect(tx.updates).toEqual([
      { id: 'c1', status: CopyStatus.BAJA },
      { id: 'c2', status: CopyStatus.BAJA },
    ]);
    expect(tx.parentWrites[0]).toEqual({ totalStock: 1, availableStock: 0, status: 'AGOTADO' });
  });

  it('rechaza estados no permitidos sin modificar nada', async () => {
    const tx = makeTx(bookCopies());
    await expect(
      applyCopyStatus(tx as any, 'book', 'b1', ['c1', 'c4'], CopyStatus.BAJA, CAN_DROP),
    ).rejects.toThrow('no permite esta operación');
    expect(tx.updates).toEqual([]);
    expect(tx.parentWrites).toEqual([]);
  });

  it('exige que los ejemplares pertenezcan al recurso', async () => {
    const tx = makeTx(bookCopies());
    await expect(applyCopyStatus(tx as any, 'book', 'b1', ['x1'], CopyStatus.BAJA, CAN_DROP)).rejects.toThrow(
      'no pertenece a este recurso',
    );
  });

  it('avisa de ejemplares inexistentes', async () => {
    const tx = makeTx(bookCopies());
    await expect(applyCopyStatus(tx as any, 'book', 'b1', ['zz'], CopyStatus.BAJA, CAN_DROP)).rejects.toThrow(
      'no existen',
    );
  });

  it('no acepta una selección vacía', async () => {
    const tx = makeTx(bookCopies());
    await expect(applyCopyStatus(tx as any, 'book', 'b1', [], CopyStatus.BAJA, CAN_DROP)).rejects.toThrow(
      'Debes seleccionar al menos un ejemplar',
    );
  });

  it('la entrada reactiva bajas y mantenimientos pero no disponibles', async () => {
    const tx = makeTx(bookCopies());
    const updated = await applyCopyStatus(tx as any, 'book', 'b1', ['c3', 'c2'], CopyStatus.DISPONIBLE, CAN_ENTER);
    expect(updated.map((c: any) => c.code).sort()).toEqual(['BK-0002', 'BK-0003']);
    await expect(applyCopyStatus(tx as any, 'book', 'b1', ['c1'], CopyStatus.DISPONIBLE, CAN_ENTER)).rejects.toThrow(
      'no permite esta operación',
    );
  });

  it('funciona igual con ejemplares de inventario', async () => {
    const tx = makeTx([{ id: 'i1', code: 'AR-0001', status: CopyStatus.BAJA, itemId: 'p1' }]);
    const updated = await applyCopyStatus(tx as any, 'item', 'p1', ['i1'], CopyStatus.DISPONIBLE, CAN_ENTER);
    expect(updated).toEqual([{ id: 'i1', code: 'AR-0001', status: CopyStatus.DISPONIBLE, itemId: 'p1' }]);
    expect(tx.parentWrites[0]).toEqual({ totalStock: 1, availableStock: 1, status: 'DISPONIBLE' });
  });
});

describe('recalcBookStock', () => {
  it('deriva totales excluyendo las bajas', async () => {
    const tx = makeTx(bookCopies());
    const summary = await recalcBookStock(tx as any, 'b1');
    expect(summary).toEqual({ total: 3, available: 1, loaned: 1, maintenance: 1, status: 'DISPONIBLE' });
  });
});
