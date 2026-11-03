import { IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty({ message: 'No puede estar vacío' })
  @IsString({ message: 'Debe ser una cadena de texto' })
  @MaxLength(100, { message: 'El título debe tener un máximo de 100 caracteres' })
  title: string;

  @IsOptional()
  @IsString({ message: 'Debe ser una cadena de texto' })
  description?: string;

  // @IsNotEmpty({ message: 'No puede estar vacío' })
  // @IsString({ message: 'Debe ser una cadena de texto' })
  // routepdf: string; // O IsUrl() si es un link

  @IsOptional()
  @IsString({ message: 'Debe ser una cadena de texto' })
  routeimg?: string;


}