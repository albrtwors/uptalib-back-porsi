import { CopyStatus } from '@prisma/client';
import { InventoryService } from './inventory.service';

interface FakeCopy {
  id: string;
  code: string;
  itemId: string;
  status: CopyStatus;
}

/**
 * El rango de códigos (codeFrom/codeTo) que llega desde los formularios de
 * inventario debe materializar los ejemplares con esos códigos exactos, igual
 * que en los libros físicos.
 */
function makeService(seed: { item?: any; copies?: FakeCopy[] } = {}) {
  const copies: FakeCopy[] = [...(seed.copies ?? [])];
  const item = {
    id: 'i1',
    name: 'Silla ejecutiva',
    code: null,
    totalStock: 0,
    availableStock: 0,
    status: 'DISPONIBLE',
    ...(seed.item ?? {}),
  };

  const tx: any = {
    copies,
    itemType: {
      findFirst: ({ where }: any) =>
        Promise.resolve({ id: 't1', name: where?.name?.equals ?? 'Papelería' }),
      create: () => Promise.resolve({ id: 't1' }),
    },
    item: {
      create: ({ data }: any) => Promise.resolve({ ...item, ...data, id: item.id }),
      findUnique: () =>
        Promise.resolve({ ...item, copies: copies.filter((c) => c.itemId === item.id) }),
      update: ({ data }: any) => {
        Object.assign(item, data);
        return Promise.resolve(item);
      },
    },
    itemCopy: {
      findMany: (args: any) => {
        const rows = copies.filter((c) => c.itemId === args.where.itemId);
        if (!args.select) return Promise.resolve(rows);
        return Promise.resolve(
          rows.map((c) =>
            Object.fromEntries(
              Object.entries(c).filter(([key]) => (args.select as any)[key]),
            ),
          ),
        );
      },
      create: ({ data }: any) => {
        const copy: FakeCopy = {
          id: `c${copies.length + 1}`,
          code: data.code,
          itemId: data.itemId,
          status: data.status ?? CopyStatus.DISPONIBLE,
        };
        copies.push(copy);
        return Promise.resolve(copy);
      },
      update: ({ where, data }: any) => {
        const copy = copies.find((c) => c.id === where.id);
        Object.assign(copy, data);
        return Promise.resolve(copy);
      },
    },
  };

  const service = new InventoryService({
    $transaction: (cb: any) => cb(tx),
  } as any);

  return { service, tx, copies, item };
}

const body = (extra: Record<string, any> = {}) => ({
  name: 'Silla ejecutiva',
  stock: '3',
  typeNames: ['Mobiliario'],
  ...extra,
});

describe('InventoryService · rango de códigos de ejemplares', () => {
  it('crea los ejemplares con el rango solicitado', async () => {
    const { service, copies } = makeService();

    await service.create(body({ code: 'INV-01', codeFrom: 'INV-001', codeTo: 'INV-003' }));

    expect(copies.map((c) => c.code)).toEqual(['INV-001', 'INV-002', 'INV-003']);
  });

  it('respeta el rango sólo para la cantidad pedida', async () => {
    const { service, copies } = makeService();

    await service.create(body({ code: 'INV-01', codeFrom: 'INV-001', codeTo: 'INV-010', stock: '2' }));

    expect(copies.map((c) => c.code)).toEqual(['INV-001', 'INV-002']);
  });

  it('sigue la secuencia del código del artículo cuando no hay rango', async () => {
    const { service, copies } = makeService();

    await service.create(body({ code: 'INV-A' }));

    expect(copies.map((c) => c.code)).toEqual(['INV-A-0001', 'INV-A-0002', 'INV-A-0003']);
  });

  it('rechaza un rango más corto que el stock', async () => {
    const { service } = makeService();

    await expect(
      service.create(body({ code: 'INV-01', codeFrom: 'INV-001', codeTo: 'INV-002' })),
    ).rejects.toThrow('El rango indicado solo permite 2 ejemplares');
  });

  it('usa el rango al ampliar el stock en una edición', async () => {
    const { service, copies } = makeService({
      item: { code: 'INV-01' },
      copies: [
        { id: 'c1', code: 'INV-001', itemId: 'i1', status: CopyStatus.DISPONIBLE },
        { id: 'c2', code: 'INV-002', itemId: 'i1', status: CopyStatus.DISPONIBLE },
      ],
    });

    await service.edit('i1', { stock: '4', codeFrom: 'INV-003', codeTo: 'INV-004' });

    expect(copies.map((c) => c.code)).toEqual(['INV-001', 'INV-002', 'INV-003', 'INV-004']);
  });

  it('no envuelve codeFrom/codeTo como campos del artículo', async () => {
    const { service, item } = makeService();

    const result: any = await service.create(body({ codeFrom: 'INV-001', codeTo: 'INV-003' }));

    expect(item.codeFrom).toBeUndefined();
    expect(result.item.totalStock).toBe(3);
  });
});
