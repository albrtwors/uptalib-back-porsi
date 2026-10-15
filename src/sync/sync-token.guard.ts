import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { timingSafeEqual } from 'crypto';

/**
 * Protege los endpoints de sincronización mediante un token compartido
 * (`SYNC_TOKEN`). Si el servidor no tiene configurado el token, la
 * sincronización queda deshabilitada para evitar sobreescrituras abiertas.
 */
@Injectable()
export class SyncTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const expected = process.env.SYNC_TOKEN;
    if (!expected) {
      throw new ServiceUnavailableException(
        'La sincronización no está configurada en el servidor (falta SYNC_TOKEN)',
      );
    }

    const request = context.switchToHttp().getRequest();
    const header = request.headers['x-sync-token'];
    const provided = Array.isArray(header) ? header[0] : header;

    if (typeof provided !== 'string' || !provided) {
      throw new UnauthorizedException('Token de sincronización ausente');
    }

    const a = Buffer.from(provided);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      throw new UnauthorizedException('Token de sincronización inválido');
    }

    return true;
  }
}
