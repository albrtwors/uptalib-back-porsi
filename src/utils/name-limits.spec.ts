import { plainToInstance } from 'class-transformer';
import { ValidationError, validateSync } from 'class-validator';

import { RegisterDto } from '../auth/dto/register.dto';
import { CreateAuthorDto } from '../author/dto/create-author.dto';
import { CreateBookDto } from '../books/dto/create-book.dto';
import { CreateInventoryDto } from '../inventory/dto/create-inventory.dto';
import { UpdateInventory } from '../inventory/dto/update-inventory.dto';
import { LoanDto as ItemLoanDto } from '../inventory-operation/dto/loan-dto';
import { CreateItemTypeDto } from '../item-type/dto/create-item-type.dto';
import { EntrieDto } from '../physical-book-operation/dto/entrie-dto';
import { MakeLoanDto } from '../physical-book-operation/dto/makeLoan.dto';
import { CreatePhysicalBookDto } from '../physical-books/dto/create-physical-book.dto';
import { CreateUserDto } from '../user/dto/user.dto';
import { CreateUserInventoryDto } from '../user-inventory/dto/create-user-inventory.dto';

const LARGO = 'a'.repeat(101);
const LIMITE = 'a'.repeat(100);

const erroresDe = (Cls: any, payload: any): ValidationError[] =>
  validateSync(plainToInstance(Cls, payload), { skipMissingProperties: false });

const fallaPor = (Cls: any, payload: any, property: string) =>
  erroresDe(Cls, payload).some((e) => e.property === property);

describe('límite de 100 caracteres en nombres y títulos', () => {
  // 💡 La regla del proyecto: ningún nombre o título pasa de 100 caracteres, sea
  // crear, editar o importar por lote. Estos casos fallarían si alguien quita el
  // @MaxLength de un DTO o declara el campo en uno nuevo sin limitarlo.
  const casos: Array<[string, any, Record<string, any>, string]> = [
    ['inventario', CreateInventoryDto, { stock: 1 }, 'name'],
    ['inventario (editar/bulk)', UpdateInventory, { stock: 1 }, 'name'],
    ['libro físico', CreatePhysicalBookDto, { yearOfPublication: 2024, totalStock: 1 }, 'title'],
    ['libro digital', CreateBookDto, {}, 'title'],
    ['autor', CreateAuthorDto, {}, 'name'],
    ['tipo de item', CreateItemTypeDto, {}, 'name'],
    ['usuario', CreateUserDto, { email: 'a@b.co', password: '123456' }, 'name'],
    ['registro', RegisterDto, { email: 'a@b.co', password: '123456' }, 'name'],
    ['usuario de inventario', CreateUserInventoryDto, { cedula: 1 }, 'name'],
    ['préstamo de item', ItemLoanDto, { itemId: 'i', personId: '1', personSurNames: 'Knox' }, 'personNames'],
    ['préstamo de libro', MakeLoanDto, { bookId: 'b', quantity: 1, personId: '1', personSurNames: 'Knox' }, 'personNames'],
    ['entrada de libro', EntrieDto, { bookId: 'b', personSurNames: 'Knox' }, 'personNames'],
  ];

  it.each(casos)('%s rechaza un nombre de más de 100 caracteres', (_nombre, Dto, base, campo) => {
    expect(fallaPor(Dto, { ...base, [campo]: LARGO }, campo)).toBe(true);
  });

  it('acepta el nombre justo en el límite', () => {
    expect(erroresDe(CreateInventoryDto, { stock: 1, name: LIMITE })).toEqual([]);
    expect(
      erroresDe(CreatePhysicalBookDto, {
        title: LIMITE,
        yearOfPublication: 2024,
        totalStock: 1,
        authorNames: ['Fulano'],
      }),
    ).toEqual([]);
  });

  it('limita también los arreglos de nombres que crean entidades al vuelo', () => {
    expect(
      fallaPor(CreatePhysicalBookDto, { title: 'Un título', yearOfPublication: 2024, totalStock: 1, authorNames: [LARGO] }, 'authorNames'),
    ).toBe(true);
    expect(
      fallaPor(CreateInventoryDto, { stock: 1, name: 'Soga', typeNames: [LARGO] }, 'typeNames'),
    ).toBe(true);
  });
});
