import { ItemStatus } from "@prisma/client"
import { Transform } from "class-transformer"
import { IsArray, IsDefined, IsInt, IsOptional, IsPositive, IsString, MaxLength, MinLength } from "class-validator"

export class CreateInventoryDto {

    @Transform(({ value }: any) => parseInt(value))
    @IsInt({ message: 'La cantidad debe ser un número entero' })
    @IsPositive({ message: 'La cantidad debe ser un número positivo' })
    stock: number

    @IsString({ message: 'El nombre debe ser texto' })
    @MaxLength(20, { message: 'El nombre debe tener un máximo de 20 caracteres' })
    @MinLength(3, { message: 'El nombre debe tener mínimo 3 caracteres' })
    name: string

    // 💡 Ahora es opcional porque puede venir typeName en su lugar
    @IsOptional()
    @IsString({ message: 'El ID del tipo debe ser una cadena de texto' })
    typeId?: string

    // 💡 Campo nuevo para cuando se crea un Tipo de Item desde cero
    @IsOptional()
    @IsString({ message: 'El nombre del tipo debe ser texto' })
    @MinLength(2, { message: 'El nombre del tipo debe tener mínimo 2 caracteres' })
    typeName?: string

    @IsOptional()
    @IsString({ message: 'El código debe ser cadena de texto' })
    code?: string

    @IsString({ message: 'La descripción debe ser texto' })
    @IsOptional()
    @MaxLength(200, { message: 'La descripción debe tener un máximo de 200 caracteres' })
    description?: string

    // 💡 Autores (uno o más por ID existente)
    @IsOptional()
    @IsArray({ message: 'Los autores deben ser un arreglo' })
    @IsString({ each: true, message: 'Cada ID de autor debe ser una cadena de texto' })
    authorIds?: string[]

    // 💡 Autores (uno o más) para crear/resolver desde cero por nombre
    @IsOptional()
    @IsArray({ message: 'Los autores deben ser un arreglo' })
    @IsString({ each: true, message: 'Cada nombre de autor debe ser una cadena de texto' })
    authorNames?: string[]

    // 💡 Compatibilidad hacia atrás: un solo nombre de autor
    @IsOptional()
    @IsString({ message: 'El nombre del autor debe ser una cadena de texto' })
    @MinLength(2, { message: 'El nombre del autor debe tener mínimo 2 caracteres' })
    authorName?: string

    // 💡 Compatibilidad hacia atrás: un solo autor por ID
    @IsOptional()
    @IsString({ message: 'El ID del autor debe ser una cadena de texto' })
    authorId?: string

    // 💡 Categorías (uno o más por ID existente)
    @IsOptional()
    @IsArray({ message: 'Las categorías deben ser un arreglo' })
    @IsString({ each: true, message: 'Cada ID de categoría debe ser una cadena de texto' })
    categoryIds?: string[]

    // 💡 Categorías (uno o más) para crear/resolver desde cero por nombre
    @IsOptional()
    @IsArray({ message: 'Las categorías deben ser un arreglo' })
    @IsString({ each: true, message: 'Cada nombre de categoría debe ser una cadena de texto' })
    categoryNames?: string[]

    // 💡 Compatibilidad hacia atrás: un solo nombre de categoría
    @IsOptional()
    @IsString({ message: 'El nombre de la categoría debe ser una cadena de texto' })
    @MinLength(2, { message: 'El nombre de la categoría debe tener mínimo 2 caracteres' })
    categoryName?: string

    // 💡 Compatibilidad hacia atrás: una sola categoría por ID
    @IsOptional()
    @IsString({ message: 'El ID de la categoría debe ser una cadena de texto' })
    categoryId?: string
}