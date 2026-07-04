import { Pnf } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsDefined, IsInt, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

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

    // 💡 Ahora es opcional porque puede venir authorName en su lugar
    @IsOptional()
    @IsString({ message: 'El ID del autor debe ser una cadena de texto' })
    authorId?: string;

    // 💡 Campo nuevo para cuando se crea un autor desde cero
    @IsOptional()
    @IsString({ message: 'El nombre del autor debe ser una cadena de texto' })
    @MinLength(2, { message: 'El nombre del autor debe tener mínimo 2 caracteres' })
    authorName?: string;

    // 💡 Ahora es opcional porque puede venir categoryName en su lugar
    @IsOptional()
    @IsString({ message: 'El ID de la categoría debe ser una cadena de texto' })
    categoryId?: string;

    // 💡 Campo nuevo para cuando se crea una categoría desde cero
    @IsOptional()
    @IsString({ message: 'El nombre de la categoría debe ser una cadena de texto' })
    @MinLength(2, { message: 'El género literario debe tener mínimo 2 caracteres' })
    categoryName?: string;

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