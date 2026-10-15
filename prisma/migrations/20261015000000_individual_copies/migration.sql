-- CreateEnum
CREATE TYPE "CopyStatus" AS ENUM ('DISPONIBLE', 'PRESTADO', 'MANTENIMIENTO', 'BAJA');

-- CreateTable
CREATE TABLE "BookCopy" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "status" "CopyStatus" NOT NULL DEFAULT 'DISPONIBLE',
    "location" TEXT,
    "observations" TEXT,
    "bookId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookCopy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemCopy" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "status" "CopyStatus" NOT NULL DEFAULT 'DISPONIBLE',
    "location" TEXT,
    "observations" TEXT,
    "itemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemCopy_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "BookOperation" ADD COLUMN "copyId" TEXT;

-- AlterTable
ALTER TABLE "ItemOperation" ADD COLUMN "copyId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "BookCopy_code_key" ON "BookCopy"("code");

-- CreateIndex
CREATE INDEX "BookCopy_bookId_status_idx" ON "BookCopy"("bookId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ItemCopy_code_key" ON "ItemCopy"("code");

-- CreateIndex
CREATE INDEX "ItemCopy_itemId_status_idx" ON "ItemCopy"("itemId", "status");

-- CreateIndex
CREATE INDEX "BookOperation_copyId_idx" ON "BookOperation"("copyId");

-- CreateIndex
CREATE INDEX "ItemOperation_copyId_idx" ON "ItemOperation"("copyId");

-- AddForeignKey
ALTER TABLE "BookCopy" ADD CONSTRAINT "BookCopy_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "PhysicalBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemCopy" ADD CONSTRAINT "ItemCopy_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookOperation" ADD CONSTRAINT "BookOperation_copyId_fkey" FOREIGN KEY ("copyId") REFERENCES "BookCopy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemOperation" ADD CONSTRAINT "ItemOperation_copyId_fkey" FOREIGN KEY ("copyId") REFERENCES "ItemCopy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- =====================================================================
--  Backfill: materializar el stock numérico existente como ejemplares
--  individuales para no romper los datos ya cargados.
--  Las unidades disponibles se marcan como DISPONIBLE y el resto (las que
--  representan préstamos vigentes) como PRESTADO.
-- =====================================================================

INSERT INTO "BookCopy" ("id", "code", "status", "bookId", "createdAt", "updatedAt")
SELECT
    md5(random()::text || clock_timestamp()::text || b.id || gs.i::text),
    'LIB-' || upper(substr(md5(b.id), 1, 8)) || '-' || lpad(gs.i::text, 4, '0'),
    (CASE WHEN gs.i <= b."availableStock" THEN 'DISPONIBLE' ELSE 'PRESTADO' END)::"CopyStatus",
    b.id,
    now(),
    now()
FROM "PhysicalBook" b
CROSS JOIN LATERAL generate_series(1, GREATEST(b."totalStock", 0)) AS gs(i);

INSERT INTO "ItemCopy" ("id", "code", "status", "itemId", "createdAt", "updatedAt")
SELECT
    md5(random()::text || clock_timestamp()::text || i.id || gs.i::text),
    'ART-' || upper(substr(md5(i.id), 1, 8)) || '-' || lpad(gs.i::text, 4, '0'),
    (CASE WHEN gs.i <= i."availableStock" THEN 'DISPONIBLE' ELSE 'PRESTADO' END)::"CopyStatus",
    i.id,
    now(),
    now()
FROM "Item" i
CROSS JOIN LATERAL generate_series(1, GREATEST(i."totalStock", 0)) AS gs(i);
