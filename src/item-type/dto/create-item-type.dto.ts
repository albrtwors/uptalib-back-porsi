import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateItemTypeDto {

    @IsString({ message: 'El tipo debe ser una cadena de texto' })
    @MinLength(3, { message: 'El tipo debe tener como minimo 3 caracteres de longitud' })
    @MaxLength(100, { message: 'El tipo debe tener un máximo de 100 caracteres' })
    name: string

}
