import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateAuthorDto {
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @MinLength(3, { message: 'El nombre debe tener mínimo 3 caracteres' })
    @MaxLength(100, { message: 'El nombre debe tener un máximo de 100 caracteres' })
    name: string
}
