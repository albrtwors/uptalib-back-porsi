import { ItemStatus } from "@prisma/client"
import { Transform } from "class-transformer"
import { IsDefined, IsInt, IsOptional, IsPositive, IsString, MaxLength, MinLength } from "class-validator"

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
}