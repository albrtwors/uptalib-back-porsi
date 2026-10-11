import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 6, { message: 'El código debe tener 6 dígitos' })
  code: string;

  @IsString()
  @MinLength(6)
  password: string;
}
