import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePnfDto {
  @IsString({ message: 'El PNF debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre del PNF debe tener como mínimo 2 caracteres' })
  @MaxLength(60, { message: 'El nombre del PNF debe tener un máximo de 60 caracteres' })
  name: string;
}
