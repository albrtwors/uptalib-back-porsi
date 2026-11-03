import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";


export class CreateUserInventoryDto {


@IsNotEmpty()
@IsString()
@MaxLength(100, { message: 'El nombre debe tener un máximo de 100 caracteres' })
name: string;


@IsNotEmpty()
@IsString()
@MaxLength(100, { message: 'El apellido debe tener un máximo de 100 caracteres' })
lastname: string;


@IsNotEmpty()
@IsNumber()

cedula: number;









}

