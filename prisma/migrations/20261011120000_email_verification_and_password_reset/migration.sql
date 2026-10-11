-- AlterTable
ALTER TABLE "User"
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verificationCode" TEXT,
ADD COLUMN     "verificationCodeExpires" TIMESTAMP(3),
ADD COLUMN     "resetCode" TEXT,
ADD COLUMN     "resetCodeExpires" TIMESTAMP(3);

-- Marcar como verificados a los usuarios ya existentes para no bloquear su acceso
UPDATE "User" SET "emailVerified" = true;
