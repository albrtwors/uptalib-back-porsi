import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          // Verificamos si existe la cookie 'jwt'
          const token = request.cookies?.jwt;

          // SI NO HAY COOKIE, RETORNAMOS NULL
          // Esto hace que Passport falle la autenticación inmediatamente ("chao")
          if (!token) {
            return null;
          }

          return token;
        }
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    // Si llegamos aquí, es porque SÍ había cookie y era válida
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }

}