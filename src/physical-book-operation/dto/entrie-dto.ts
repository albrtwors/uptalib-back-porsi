import { OperationType } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsArray, IsDefined, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength, MinLength } from "class-validator";

export class EntrieDto {
    @Transform(({ value }: any) => parseInt(value))
    @IsInt({ message: 'La cantidad debe ser un numero entero' })
    @IsPositive({ message: 'La cantidad debe ser un numero positivo' })
    quantity: number

    @IsDefined({ message: 'Debes incluir un Item para dar entradas' })
    bookId: string

    // 🎯 Códigos opcionales para los nuevos ejemplares (si no se envían se autogeneran)
    @IsOptional()
    @IsArray({ message: 'Los códigos deben ser un arreglo' })
    @IsString({ each: true, message: 'Cada código debe ser una cadena de texto' })
    codes?: string[]


    @IsString({ message: 'Los nombres deben ser texto' })
    @MinLength(3, { message: 'Los nombres deben tener minimo 3 caracteres' })
    @MaxLength(40, { message: 'Los nombres deben tener maximo 40 caracteres' })
    personNames: string


    @IsString({ message: 'Los apellidos deben ser texto' })
    @MinLength(3, { message: 'Los apellidos deben tener minimo 3 caracteres' })
    @MaxLength(40, { message: 'Los apellidos deben tener maximo 40 caracteres' })
    personSurNames: string



}