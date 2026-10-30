import { Transform } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateInventoryDto {
  @Transform(({ value }: any) => parseInt(value))
  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @IsPositive({ message: 'La cantidad debe ser un número positivo' })
  stock: number;

  @IsString({ message: 'El nombre debe ser texto' })
  @MaxLength(20, { message: 'El nombre debe tener un máximo de 20 caracteres' })
  @MinLength(3, { message: 'El nombre debe tener mínimo 3 caracteres' })
  name: string;

  @IsOptional()
  @IsString({ message: 'El código debe ser cadena de texto' })
  code?: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto' })
  @MaxLength(200, {
    message: 'La descripción debe tener un máximo de 200 caracteres',
  })
  description?: string;

  @IsOptional()
  @IsArray({ message: 'Los tipos deben ser un arreglo' })
  @IsString({
    each: true,
    message: 'Cada ID de tipo debe ser una cadena de texto',
  })
  typeIds?: string[];

  @IsOptional()
  @IsArray({ message: 'Los tipos deben ser un arreglo' })
  @IsString({
    each: true,
    message: 'Cada nombre de tipo debe ser una cadena de texto',
  })
  typeNames?: string[];

  // Compatibilidad con clientes anteriores que envían un solo tipo.
  @IsOptional()
  @IsString({ message: 'El ID del tipo debe ser una cadena de texto' })
  typeId?: string;

  @IsOptional()
  @IsString({ message: 'El nombre del tipo debe ser texto' })
  @MinLength(2, {
    message: 'El nombre del tipo debe tener mínimo 2 caracteres',
  })
  typeName?: string;

  @IsOptional()
  @IsArray({ message: 'Los códigos de ejemplar deben ser un arreglo' })
  @IsString({
    each: true,
    message: 'Cada código de ejemplar debe ser una cadena de texto',
  })
  copyCodes?: string[];
}
