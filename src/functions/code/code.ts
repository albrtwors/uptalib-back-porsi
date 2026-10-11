import * as bcrypt from 'bcrypt';

// Tiempo de vida de los códigos de verificación/recuperación (15 minutos)
export const CODE_TTL_MS = 15 * 60 * 1000;

export const generateVerificationCode = (): string =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const hashCode = (code: string): Promise<string> => bcrypt.hash(code, 10);
