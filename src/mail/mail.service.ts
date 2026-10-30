import {
  Injectable,
  InternalServerErrorException,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

type MailMode = 'gmail-oauth2' | 'gmail-app-password' | 'smtp';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: nodemailer.Transporter | null;
  private readonly from: string;
  private readonly mode: MailMode | null;

  constructor(private readonly configService: ConfigService) {
    const user = this.getEnv('MAIL_USER');
    const password = this.getEnv('MAIL_PASSWORD');
    const clientId = this.getEnv('GOOGLE_CLIENT_ID');
    const clientSecret = this.getEnv('GOOGLE_CLIENT_SECRET');
    const refreshToken = this.getEnv('GOOGLE_REFRESH_TOKEN');
    const configuredService = this.getEnv('MAIL_SERVICE')?.toLowerCase();
    const host =
      this.getEnv('MAIL_HOST') ||
      (user?.toLowerCase().includes('@gmail.com')
        ? 'smtp.gmail.com'
        : undefined);
    const port = Number(this.getEnv('MAIL_PORT')) || 587;
    const secureValue = this.getEnv('MAIL_SECURE');
    const secure = secureValue ? secureValue === 'true' : port === 465;

    const useGmail =
      configuredService === 'gmail' ||
      configuredService === 'google' ||
      host?.toLowerCase() === 'smtp.gmail.com' ||
      user?.toLowerCase().endsWith('@gmail.com');

    const hasGoogleOAuth = Boolean(
      user && clientId && clientSecret && refreshToken,
    );
    const hasPassword = Boolean(user && password);

    this.from =
      this.getEnv('MAIL_FROM') ||
      (user ? `UPTALib <${user}>` : 'UPTALib <no-reply@uptalib.com>');

    if (hasGoogleOAuth) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user,
          clientId,
          clientSecret,
          refreshToken,
        },
      });
      this.mode = 'gmail-oauth2';
    } else if (hasPassword && useGmail) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user,
          pass: password,
        },
      });
      this.mode = 'gmail-app-password';
    } else if (hasPassword) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user,
          pass: password,
        },
      });
      this.mode = 'smtp';
    } else if (host && !useGmail) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure,
      });
      this.mode = 'smtp';
    } else {
      this.transporter = null;
      this.mode = null;
    }

    if (!this.transporter) {
      this.logger.warn(
        'Correo no configurado. Define GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN y MAIL_USER, o MAIL_USER y MAIL_PASSWORD (contraseña de aplicación de Gmail).',
      );
      return;
    }

    this.logger.log(`Servicio de correo configurado en modo ${this.mode}`);
  }

  private getEnv(key: string): string | undefined {
    const value = this.configService.get<string | number>(key);
    if (value === undefined || value === null) {
      return undefined;
    }

    const normalized = String(value).trim();
    return normalized.length > 0 ? normalized : undefined;
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

  private async send(
    to: string,
    subject: string,
    message: string,
    heading: string,
  ) {
    if (!this.transporter) {
      this.logger.error(
        'No se intentó enviar el correo porque el servicio no está configurado',
      );
      throw new ServiceUnavailableException(
        'El servicio de correo no está configurado. Contacta al administrador.',
      );
    }

    try {
      const info = await this.transporter.sendMail({
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

      if (info.rejected?.length) {
        this.logger.warn(
          `El correo fue rechazado para: ${info.rejected.join(', ')}`,
        );
      }

      if (info.messageId) {
        this.logger.log(
          `Correo enviado con id ${info.messageId} en modo ${this.mode}`,
        );
      }
    } catch (error) {
      const mailError = error as Error & { code?: string; response?: string };
      const details = [mailError.message, mailError.code, mailError.response]
        .filter(Boolean)
        .join(' | ');

      this.logger.error(
        `No se pudo enviar el correo a ${to}: ${details}`,
        mailError.stack,
      );
      throw new InternalServerErrorException(
        'No se pudo enviar el correo. Inténtalo de nuevo más tarde.',
      );
    }
  }
}
