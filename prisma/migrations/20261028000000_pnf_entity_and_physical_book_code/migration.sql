-- PNF pasa de enum Postgres a tabla creable desde la aplicación.
-- Los valores históricos del enum se conservan para no perder datos.

-- CreateTable
CREATE TABLE "Pnf" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pnf_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pnf_name_key" ON "Pnf"("name");

-- Seed de los valores que antes vivían en el enum "Pnf"
INSERT INTO "Pnf" ("id", "name", "createdAt", "updatedAt") VALUES
    ('pnf_general', 'GENERAL', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('pnf_informatica', 'INFORMATICA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('pnf_electronica', 'ELECTRONICA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('pnf_mantenimiento', 'MANTENIMIENTO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('pnf_contaduria', 'CONTADURIA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('pnf_administracion', 'ADMINISTRACION', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('pnf_electricidad', 'ELECTRICIDAD', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('pnf_mecanica', 'MECANICA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('pnf_instrumentacion', 'INSTRUMENTACION', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('pnf_telecomunicaciones', 'TELECOMUNICACIONES', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- CreateTable (relación implícita Prisma PhysicalBook <-> Pnf)
CREATE TABLE "_PhysicalBookToPnf" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PhysicalBookToPnf_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PhysicalBookToPnf_B_index" ON "_PhysicalBookToPnf"("B");

-- Migrar el PNF único de cada libro físico a la nueva relación múltiple
INSERT INTO "_PhysicalBookToPnf" ("A", "B")
SELECT p."id", n."id"
FROM "PhysicalBook" p
JOIN "Pnf" n ON n."name" = p."pnf"::text
WHERE p."pnf" IS NOT NULL;

-- AddForeignKey
ALTER TABLE "_PhysicalBookToPnf" ADD CONSTRAINT "_PhysicalBookToPnf_A_fkey" FOREIGN KEY ("A") REFERENCES "PhysicalBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PhysicalBookToPnf" ADD CONSTRAINT "_PhysicalBookToPnf_B_fkey" FOREIGN KEY ("B") REFERENCES "Pnf"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrar BookPnf del enum al id de la nueva tabla
ALTER TABLE "BookPnf" ADD COLUMN "pnfId" TEXT;

UPDATE "BookPnf" b
SET "pnfId" = n."id"
FROM "Pnf" n
WHERE n."name" = b."pnf"::text;

ALTER TABLE "BookPnf" ALTER COLUMN "pnfId" SET NOT NULL;

DROP INDEX "BookPnf_bookId_pnf_key";

ALTER TABLE "BookPnf" DROP COLUMN "pnf";

CREATE UNIQUE INDEX "BookPnf_bookId_pnfId_key" ON "BookPnf"("bookId", "pnfId");

ALTER TABLE "BookPnf" ADD CONSTRAINT "BookPnf_pnfId_fkey" FOREIGN KEY ("pnfId") REFERENCES "Pnf"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- El PNF único del libro físico ya vive en "_PhysicalBookToPnf"
ALTER TABLE "PhysicalBook" DROP COLUMN "pnf";

-- Código propio del libro físico (independiente del ISBN)
ALTER TABLE "PhysicalBook" ADD COLUMN "code" TEXT;

CREATE UNIQUE INDEX "PhysicalBook_code_key" ON "PhysicalBook"("code");

-- DropEnum
DROP TYPE "Pnf";
