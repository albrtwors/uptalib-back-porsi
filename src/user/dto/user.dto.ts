import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

// Define the Role enum locally if not exported by Prisma
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  LIBRARIAN = 'LIBRARIAN',
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100, { message: 'El nombre debe tener un máximo de 100 caracteres' })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;


}

export class CreateUserAdminDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100, { message: 'El nombre debe tener un máximo de 100 caracteres' })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}