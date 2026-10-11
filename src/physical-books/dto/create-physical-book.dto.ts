import { Transform } from "class-transformer";
import { IsArray, IsDefined, IsInt, IsOptional, IsPositive, IsString, MinLength } from "class-validator";
import { Pnf } from "@prisma/client";

export class CreatePhysicalBookDto {

    @IsString({ message: 'El título del libro debe ser una cadena de texto' })
    @MinLength(3, { message: 'El nombre del libro debe tener mínimo 3 caracteres' })
    title: string;

    @IsOptional()
    @IsString({ message: 'El código ISBN debe ser cadena de texto' })
    isbn?: string;

    @Transform(({ value }: any) => parseInt(value))
    @IsInt({ message: 'El año de publicación debe ser un número entero' })
    @IsPositive({ message: 'El año de publicación debe ser un número positivo' })
    yearOfPublication: number;

    // 💡 Autores (uno o más por ID existente)
    @IsOptional()
    @IsArray({ message: 'Los autores deben ser un arreglo' })
    @IsString({ each: true, message: 'Cada ID de autor debe ser una cadena de texto' })
    authorIds?: string[];

    // 💡 Autores (uno o más) para crear/resolver desde cero por nombre
    @IsOptional()
    @IsArray({ message: 'Los autores deben ser un arreglo' })
    @IsString({ each: true, message: 'Cada nombre de autor debe ser una cadena de texto' })
    authorNames?: string[];

    // 💡 Compatibilidad hacia atrás: un solo nombre de autor
    @IsOptional()
    @IsString({ message: 'El nombre del autor debe ser una cadena de texto' })
    @MinLength(2, { message: 'El nombre del autor debe tener mínimo 2 caracteres' })
    authorName?: string;

    // 💡 Compatibilidad hacia atrás: un solo autor por ID
    @IsOptional()
    @IsString({ message: 'El ID del autor debe ser una cadena de texto' })
    authorId?: string;

    // 💡 Categorías / géneros (uno o más por ID existente)
    @IsOptional()
    @IsArray({ message: 'Las categorías deben ser un arreglo' })
    @IsString({ each: true, message: 'Cada ID de categoría debe ser una cadena de texto' })
    categoryIds?: string[];

    // 💡 Categorías / géneros (uno o más) para crear/resolver desde cero por nombre
    @IsOptional()
    @IsArray({ message: 'Las categorías deben ser un arreglo' })
    @IsString({ each: true, message: 'Cada nombre de categoría debe ser una cadena de texto' })
    categoryNames?: string[];

    // 💡 Compatibilidad hacia atrás: un solo nombre de categoría
    @IsOptional()
    @IsString({ message: 'El nombre de la categoría debe ser una cadena de texto' })
    @MinLength(2, { message: 'El género literario debe tener mínimo 2 caracteres' })
    categoryName?: string;

    // 💡 Compatibilidad hacia atrás: una sola categoría por ID
    @IsOptional()
    @IsString({ message: 'El ID de la categoría debe ser una cadena de texto' })
    categoryId?: string;

    @IsString()
    @IsDefined({ message: 'Debes incluir un PNF' })
    pnf: Pnf;

    @IsString()
    @MinLength(3, { message: 'La editorial debe tener un mínimo de 3 caracteres' })
    @IsDefined({ message: 'Debes incluir una editorial' })
    editorial: string;

    @Transform(({ value }: any) => parseInt(value))
    @IsInt()
    @IsPositive({ message: 'El stock debe ser un número positivo' })
    totalStock: number;
}