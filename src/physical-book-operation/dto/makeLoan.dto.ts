import { OperationType } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsInt, IsOptional, isString, IsString, MaxLength, MinLength } from "class-validator";

export class MakeLoanDto {
    @IsString()
    bookId: string

    // @IsString()
    // type: OperationType

    @Transform(({ value }: any) => parseInt(value))
    @IsInt()
    quantity: number

    @IsString()
    @IsOptional()
    observations: string

    @IsString()
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