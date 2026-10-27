import { BadRequestException, Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserAdminDto, CreateUserDto } from './dto/user.dto';
import { MailService } from '../mail/mail.service';
import { CODE_TTL_MS, generateVerificationCode, hashCode } from '../functions/code/code';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client'; // Importamos el enum real de Prisma
import { getPagination } from '../functions/pagination/getPagination';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private mailService: MailService) { }

  async findAll(query: any) {
    const search = query.search || ''
    const where: any = {}
    const { take, page, skip } = getPagination(query)

    if (query.search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    const data = await this.prisma.user.findMany({
      where,
      take,
      skip,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isBlocked: true,
        emailVerified: true,
      },
    })
    const totalPages = await this.prisma.user.count({ where })

    return { data, totalPages }
  }

  async createByAdmin(createUserDto: CreateUserAdminDto) {
    const { email, password, name, role } = createUserDto;

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { name: name }
        ]
      }
    });

    if (existingUser) {
      throw new ConflictException('Las credenciales están registradas');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role,
        emailVerified: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isBlocked: true,
        emailVerified: true,
      },
    });

    return {
      status: 'success',
      message: 'Usuario creado correctamente',
      user,
    };
  }

  async blockUser(id: number) {
    const user = await this.prisma.user.update({ where: { id }, data: { isBlocked: true } })
    return { status: 'success', message: 'Usuario Bloqueado' }
  }
  async unBlockUser(id: number) {
    const user = await this.prisma.user.update({ where: { id }, data: { isBlocked: false } })
    return { status: 'success', message: 'Usuario Desbloqueado' }
  }

  async create(createUserDto: CreateUserDto) {
    const { email, password, name } = createUserDto;

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { name: name }
        ]
      }

    });

    if (existingUser) {
      throw new ConflictException('Las credenciales están registradas');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationCode = generateVerificationCode();

    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "USER",
        emailVerified: false,
        verificationCode: await hashCode(verificationCode),
        verificationCodeExpires: new Date(Date.now() + CODE_TTL_MS),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    await this.mailService.sendVerificationCode(email, verificationCode);

    return user;
  }


  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }


  async updateRole(id: number, newRole: Role) { // Cambiamos 'any' por 'Role'
    if (!Object.values(Role).includes(newRole)) {
      throw new BadRequestException('Rol inválido');
    }

    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: { role: newRole },
        select: {
          id: true,
          email: true,
          role: true,
        },
      });

      return {
        status: 'success',
        message: 'Rol actualizado correctamente',
        user,
      };
    } catch (error) {
      throw new NotFoundException(`No se encontró el usuario con ID ${id}`);
    }
  }

  async getUserRole(id: number) {
    const role = await this.prisma.user.findUnique({ where: { id } })
    return { role: role.role }

  }


  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        saves: {
          include: {
            book: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    // Eliminamos la contraseña del objeto antes de retornar por si acaso
    const { password, ...result } = user;
    return result;
  }
  async updateMe(id: number, updateDto: { name?: string; email?: string; password?: string }) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const dataToUpdate: any = {};

    if (updateDto.name) dataToUpdate.name = updateDto.name;

    if (updateDto.email && updateDto.email !== user.email) {
      // Validar que el nuevo correo no esté tomado
      const emailExists = await this.prisma.user.findUnique({ where: { email: updateDto.email } });
      if (emailExists) throw new ConflictException('El correo ya se encuentra registrado');
      dataToUpdate.email = updateDto.email;
    }

    if (updateDto.password && updateDto.password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      dataToUpdate.password = await bcrypt.hash(updateDto.password, salt);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    });

    return { message: 'Perfil actualizado con éxito', user: updatedUser };
  }
}

//asd