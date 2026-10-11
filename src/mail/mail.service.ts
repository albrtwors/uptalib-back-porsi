import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly from: string;

  constructor(private readonly configService: ConfigService) {
    this.from =
      this.configService.get<string>('MAIL_FROM') || 'UPTALib <no-reply@uptalib.com>';

    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: Number(this.configService.get<string>('MAIL_PORT')) || 587,
      secure: this.configService.get<string>('MAIL_SECURE') === 'true',
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    });
  }

  async sendVerificationCode(to: string, code: string) {
    await this.send(
      to,
      'Verifica tu cuenta de UPTALib',
      `Tu código de verificación es: ${code}. Expira en 15 minutos.`,
      'Verifica tu cuenta',
    );
  }

  async sendPasswordResetCode(to: string, code: string) {
    await this.send(
      to,
      'Recuperación de contraseña - UPTALib',
      `Tu código para restablecer la contraseña es: ${code}. Expira en 15 minutos.`,
      'Restablece tu contraseña',
    );
  }

  private async send(to: string, subject: string, message: string, heading: string) {
    try {
      await this.transporter.sendMail({
        from: this.from,
        to,
        subject,
        text: message,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #1d4ed8;">${heading}</h2>
            <p>${message}</p>
            <p style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #111827;">${message.match(/\d{6}/)?.[0] ?? ''}</p>
            <p style="color: #6b7280; font-size: 12px;">Si no solicitaste este correo, puedes ignorarlo.</p>
          </div>
        `,
      });
    } catch (error) {
      this.logger.error(`No se pudo enviar el correo a ${to}`, error as Error);
      throw new InternalServerErrorException(
        'No se pudo enviar el correo. Inténtalo de nuevo más tarde.',
      );
    }
  }
}
