import { Transform } from "class-transformer";
import { IsArray, IsInt, IsOptional, IsPositive, IsString, MaxLength, MinLength } from "class-validator";

export class CreatePhysicalBookDto {

    @IsString({ message: 'El título del libro debe ser una cadena de texto' })
    @MinLength(3, { message: 'El nombre del libro debe tener mínimo 3 caracteres' })
    @MaxLength(100, { message: 'El título del libro debe tener un máximo de 100 caracteres' })
    title: string;

    @IsOptional()
    @IsString({ message: 'El código ISBN debe ser cadena de texto' })
    isbn?: string;

    // 💡 Código propio del libro, independiente del ISBN. Base para los ejemplares.
    @IsOptional()
    @IsString({ message: 'El código del libro debe ser cadena de texto' })
    code?: string;

    // 💡 Códigos opcionales para los nuevos ejemplares
    @IsOptional()
    @IsArray({ message: 'Los códigos de ejemplar deben ser un arreglo' })
    @IsString({ each: true, message: 'Cada código de ejemplar debe ser una cadena de texto' })
    copyCodes?: string[];

    // 💡 Rango opcional para generar los códigos de los ejemplares
    @IsOptional()
    @IsString({ message: 'El código inicial debe ser cadena de texto' })
    codeFrom?: string;

    @IsOptional()
    @IsString({ message: 'El código final debe ser cadena de texto' })
    codeTo?: string;

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
    @MaxLength(100, { each: true, message: 'Cada nombre de autor debe tener un máximo de 100 caracteres' })
    authorNames?: string[];

    // 💡 Compatibilidad hacia atrás: un solo nombre de autor
    @IsOptional()
    @IsString({ message: 'El nombre del autor debe ser una cadena de texto' })
    @MinLength(2, { message: 'El nombre del autor debe tener mínimo 2 caracteres' })
    @MaxLength(100, { message: 'El nombre del autor debe tener un máximo de 100 caracteres' })
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
    @MaxLength(100, { each: true, message: 'Cada nombre de categoría debe tener un máximo de 100 caracteres' })
    categoryNames?: string[];

    // 💡 Compatibilidad hacia atrás: un solo nombre de categoría
    @IsOptional()
    @IsString({ message: 'El nombre de la categoría debe ser una cadena de texto' })
    @MinLength(2, { message: 'El género literario debe tener mínimo 2 caracteres' })
    @MaxLength(100, { message: 'El nombre de la categoría debe tener un máximo de 100 caracteres' })
    categoryName?: string;

    // 💡 Compatibilidad hacia atrás: una sola categoría por ID
    @IsOptional()
    @IsString({ message: 'El ID de la categoría debe ser una cadena de texto' })
    categoryId?: string;

    // 💡 PNFs por id existente
    @IsOptional()
    @IsArray({ message: 'Los PNFs deben ser un arreglo' })
    @IsString({ each: true, message: 'Cada ID de PNF debe ser una cadena de texto' })
    pnfIds?: string[];

    // 💡 PNFs por nombre (se crean si no existen)
    @IsOptional()
    @IsArray({ message: 'Los PNFs deben ser un arreglo' })
    @IsString({ each: true, message: 'Cada nombre de PNF debe ser una cadena de texto' })
    @MaxLength(100, { each: true, message: 'Cada nombre de PNF debe tener un máximo de 100 caracteres' })
    pnfNames?: string[];

    // 💡 Compatibilidad hacia atrás con el PNF único
    @IsOptional()
    @IsString({ message: 'El PNF debe ser una cadena de texto' })
    @MaxLength(100, { message: 'El nombre del PNF debe tener un máximo de 100 caracteres' })
    pnf?: string;

    @IsOptional()
    @IsString({ message: 'El ID del PNF debe ser una cadena de texto' })
    pnfId?: string;

    // 💡 Compatibilidad con arreglos de nombres de PNF
    @IsOptional()
    @IsArray({ message: 'Los PNFs deben ser un arreglo' })
    @IsString({ each: true, message: 'Cada nombre de PNF debe ser una cadena de texto' })
    @MaxLength(100, { each: true, message: 'Cada nombre de PNF debe tener un máximo de 100 caracteres' })
    pnfs?: string[];

    @IsOptional()
    @Transform(({ value }: any) => (`${value ?? ''}`.trim() || undefined))
    @IsString({ message: 'La editorial debe ser una cadena de texto' })
    @MinLength(3, { message: 'La editorial debe tener un mínimo de 3 caracteres' })
    editorial?: string;

    @Transform(({ value }: any) => parseInt(value))
    @IsInt()
    @IsPositive({ message: 'El stock debe ser un número positivo' })
    totalStock: number;
}