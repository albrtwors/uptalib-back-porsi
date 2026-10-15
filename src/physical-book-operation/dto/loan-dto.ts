import { OperationType } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsArray, IsDefined, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength, MinLength } from "class-validator";

export class LoanDto {
    @Transform(({ value }: any) => parseInt(value))
    @IsInt({ message: 'La cantidad debe ser un numero entero' })
    @IsPositive({ message: 'La cantidad debe ser un numero positivo' })
    @IsOptional()
    quantity?: number

    // 🎯 Ejemplares específicos a prestar (control por copia individual)
    @IsOptional()
    @IsArray({ message: 'Los ejemplares deben ser un arreglo' })
    @IsString({ each: true, message: 'Cada ejemplar debe ser una cadena de texto' })
    copyIds?: string[]

    @IsDefined({ message: 'Debes incluir un libro a prestar' })
    bookId: string


    @IsString({ message: 'Las observaciones deben ser una cadena de texto' })
    @IsOptional()
    @MaxLength(200, { message: 'Las observaciones deben tener un máximo de 200 caracteres' })
    observations?: string


    @IsString({ message: 'La cedula debe ser una cadena de texto' })
    @IsDefined({ message: 'Debes incluir Una cedula' })
    @IsNotEmpty({ message: 'El campo cedula no puede estar vacío' })
    personId: string

    @IsString({ message: 'Los nombres deben ser texto' })
    @MinLength(3, { message: 'Los nombres deben tener minimo 3 caracteres' })
    @MaxLength(40, { message: 'Los nombres deben tener maximo 40 caracteres' })
    personNames: string


    @IsString({ message: 'Los apellidos deben ser texto' })
    @MinLength(3, { message: 'Los apellidos deben tener minimo 3 caracteres' })
    @MaxLength(40, { message: 'Los apellidos deben tener maximo 40 caracteres' })
    personSurNames: string



}