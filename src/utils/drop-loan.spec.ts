import { CopyStatus } from '@prisma/client';
import { PhysicalBookOperationService } from '../physical-book-operation/physical-book-operation.service';
import { InventoryOperationService } from '../inventory-operation/inventory-operation.service';

interface Seed {
  copies: any[];
  parent: any;
  operations: any[];
}

const PARENT_ID = { book: 'b1', item: 'p1' } as const;
const MODELS = {
  book: { op: 'bookOperation', copy: 'bookCopy', parent: 'physicalBook', fk: 'bookId' },
  item: { op: 'itemOperation', copy: 'itemCopy', parent: 'item', fk: 'itemId' },
} as const;

function makeScenario(kind: 'book' | 'item', seed: Seed) {
  const models = MODELS[kind];
  const parentId = PARENT_ID[kind];
  const state = {
    copies: seed.copies,
    parents: { [seed.parent.id]: seed.parent },
    operations: [...seed.operations],
    created: [] as any[],
  };

  const tx: any = {
    [models.op]: {
      findUnique: ({ where }: any) => Promise.resolve(state.operations.find((o) => o.id === where.id)),
      create: ({ data }: any) => {
        const row = { id: `op${state.created.length + 1}`, ...data };
        state.operations.push(row);
        state.created.push(row);
        return Promise.resolve(row);
      },
      update: ({ where, data }: any) => {
        const row = state.operations.find((o) => o.id === where.id);
        Object.assign(row, data);
        return Promise.resolve(row);
      },
    },
    [models.copy]: {
      findMany: ({ where }: any) =>
        Promise.resolve(state.copies.filter((c) => c[models.fk] === where[models.fk]).map((c) => ({ status: c.status }))),
      update: ({ where, data }: any) => {
        const copy = state.copies.find((c) => c.id === where.id);
        Object.assign(copy, data);
        return Promise.resolve(copy);
      },
    },
    [models.parent]: {
      findUnique: ({ where }: any) => Promise.resolve(state.parents[where.id]),
      update: ({ where, data }: any) => {
        Object.assign(state.parents[where.id], data);
        return Promise.resolve(state.parents[where.id]);
      },
    },
  };

  const prisma = { $transaction: (cb: any) => cb(tx) };
  const service =
    kind === 'book'
      ? new PhysicalBookOperationService(prisma as any)
      : new InventoryOperationService(prisma as any);

  return { service, state, parentId };
}

const activeLoan = (parentId: string, copyId: string | null, quantity = 1) => ({
  id: 'l1',
  type: 'PRESTAMO',
  wasSettled: false,
  quantity,
  observations: 'Se mojó',
  personId: 'pe1',
  personNames: 'Johnny',
  personSurNames: 'Knoxville',
  copyId,
  bookId: parentId,
  itemId: parentId,
});

describe.each([
  ['book', 'b1'],
  ['item', 'p1'],
] as const)('%s: dar de baja un préstamo en curso', (kind, parentId) => {
  it('retira el ejemplar, liquida el préstamo y recalcula el stock', async () => {
    const { service, state } = makeScenario(kind, {
      copies: [
        { id: 'c1', code: 'X-0001', status: CopyStatus.DISPONIBLE, bookId: 'b1', itemId: 'p1' },
        { id: 'c2', code: 'X-0002', status: CopyStatus.PRESTADO, bookId: 'b1', itemId: 'p1' },
      ],
      parent: { id: parentId, totalStock: 2, availableStock: 1, status: 'DISPONIBLE' },
      operations: [activeLoan(parentId, 'c2')],
    });

    const result = await service.dropLoan('l1');

    expect(result.message).toContain('baja');
    expect(state.copies.find((c: any) => c.id === 'c2').status).toBe(CopyStatus.BAJA);
    expect(state.operations.find((o: any) => o.id === 'l1').wasSettled).toBe(true);
    expect(state.created).toHaveLength(1);
    expect(state.created[0]).toMatchObject({ type: 'BAJA', quantity: 1, copyId: 'c2', observations: 'Se mojó' });
    // el ejemplar dado de baja sale del total: sólo queda c1 disponible
    expect(state.parents[parentId]).toMatchObject({ totalStock: 1, availableStock: 1 });
  });

  it('no deja cerrar el mismo préstamo dos veces', async () => {
    const { service, state } = makeScenario(kind, {
      copies: [{ id: 'c2', code: 'X-0002', status: CopyStatus.PRESTADO, bookId: 'b1', itemId: 'p1' }],
      parent: { id: parentId, totalStock: 1, availableStock: 0, status: 'AGOTADO' },
      operations: [activeLoan(parentId, 'c2')],
    });

    await service.dropLoan('l1');
    await expect(service.dropLoan('l1')).rejects.toThrow('ya fue cerrado');
    expect(state.created).toHaveLength(1);
  });

  it('rechaza operaciones que no son préstamos', async () => {
    const { service } = makeScenario(kind, {
      copies: [],
      parent: { id: parentId, totalStock: 1, availableStock: 1, status: 'DISPONIBLE' },
      operations: [{ ...activeLoan(parentId, null), type: 'DEVOLUCION' }],
    });
    await expect(service.dropLoan('l1')).rejects.toThrow('Sólo puedes dar de baja un préstamo');
  });

  it('avisa cuando el préstamo no existe', async () => {
    const { service } = makeScenario(kind, {
      copies: [],
      parent: { id: parentId, totalStock: 1, availableStock: 1, status: 'DISPONIBLE' },
      operations: [],
    });
    await expect(service.dropLoan('zz')).rejects.toThrow('Préstamo no encontrado');
  });

  it('descuenta el stock en préstamos antiguos sin ejemplar', async () => {
    const { service, state } = makeScenario(kind, {
      copies: [],
      parent: { id: parentId, totalStock: 5, availableStock: 3, status: 'DISPONIBLE' },
      operations: [activeLoan(parentId, null, 2)],
    });

    await service.dropLoan('l1');

    expect(state.created[0]).toMatchObject({ type: 'BAJA', quantity: 2, copyId: null });
    expect(state.parents[parentId].totalStock).toBe(3);
    expect(state.parents[parentId].availableStock).toBe(3);
  });
});
