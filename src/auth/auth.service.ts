import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { CODE_TTL_MS, generateVerificationCode, hashCode } from '../functions/code/code';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
    private mailService: MailService,
  ) { }

  logout(res: any) {
    res.clearCookie('jwt')
    return { message: 'Sesión Cerrada', status: 'success' }

  }

  async register(registerDto: RegisterDto) {
    await this.usersService.create(registerDto);
    return {
      state: 'success',
      message: 'Usuario registrado. Revisa tu correo para verificar la cuenta.',
    };
  }

  async verifyEmail(email: string, code: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (user.emailVerified) {
      return { state: 'success', message: 'La cuenta ya está verificada' };
    }

    if (!user.verificationCode || !user.verificationCodeExpires) {
      throw new BadRequestException('No hay un código de verificación activo');
    }

    if (user.verificationCodeExpires < new Date()) {
      throw new BadRequestException('El código ha expirado. Solicita uno nuevo.');
    }

    const isMatch = await bcrypt.compare(code, user.verificationCode);
    if (!isMatch) throw new BadRequestException('Código de verificación incorrecto');

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationCode: null,
        verificationCodeExpires: null,
      },
    });

    return { state: 'success', message: 'Cuenta verificada correctamente' };
  }

  async resendVerification(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (user.emailVerified) {
      return { state: 'success', message: 'La cuenta ya está verificada' };
    }

    const code = generateVerificationCode();

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        verificationCode: await hashCode(code),
        verificationCodeExpires: new Date(Date.now() + CODE_TTL_MS),
      },
    });

    await this.mailService.sendVerificationCode(email, code);

    return { state: 'success', message: 'Código de verificación reenviado' };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    // No revelamos si el correo está registrado o no
    if (user) {
      const code = generateVerificationCode();

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          resetCode: await hashCode(code),
          resetCodeExpires: new Date(Date.now() + CODE_TTL_MS),
        },
      });

      await this.mailService.sendPasswordResetCode(email, code);
    }

    return {
      state: 'success',
      message:
        'Si el correo está registrado, recibirás un código para restablecer tu contraseña.',
    };
  }

  async resetPassword(email: string, code: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (!user.resetCode || !user.resetCodeExpires) {
      throw new BadRequestException('No hay una solicitud de recuperación activa');
    }

    if (user.resetCodeExpires < new Date()) {
      throw new BadRequestException('El código ha expirado. Solicita uno nuevo.');
    }

    const isMatch = await bcrypt.compare(code, user.resetCode);
    if (!isMatch) throw new BadRequestException('Código de recuperación incorrecto');

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetCode: null,
        resetCodeExpires: null,
        emailVerified: true,
      },
    });

    return { state: 'success', message: 'Contraseña actualizada correctamente' };
  }

  async login(email: string, pass: string, res: Response) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) throw new UnauthorizedException('Contraseña incorrecta');

    if (!user.emailVerified) {
      throw new ForbiddenException(
        'Debes verificar tu correo antes de iniciar sesión',
      );
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    res.cookie('jwt', token, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: 12 * 60 * 60 * 1000,
    })


    return {
      state: 'success',
      message: 'Login exitoso',

    };
  }
}
