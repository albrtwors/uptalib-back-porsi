-- CreateTable
CREATE TABLE "_AuthorToPhysicalBook" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AuthorToPhysicalBook_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AuthorToPhysicalBook_B_index" ON "_AuthorToPhysicalBook"("B");

-- CreateTable
CREATE TABLE "_CategoryToPhysicalBook" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoryToPhysicalBook_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CategoryToPhysicalBook_B_index" ON "_CategoryToPhysicalBook"("B");

-- CreateTable
CREATE TABLE "_AuthorToItem" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AuthorToItem_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AuthorToItem_B_index" ON "_AuthorToItem"("B");

-- CreateTable
CREATE TABLE "_CategoryToItem" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoryToItem_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CategoryToItem_B_index" ON "_CategoryToItem"("B");

-- Migrar los datos existentes de las relaciones 1:N hacia las nuevas tablas pivote
INSERT INTO "_AuthorToPhysicalBook" ("A", "B")
SELECT "authorId", "id" FROM "PhysicalBook" WHERE "authorId" IS NOT NULL;

INSERT INTO "_CategoryToPhysicalBook" ("A", "B")
SELECT "categoryId", "id" FROM "PhysicalBook" WHERE "categoryId" IS NOT NULL;

-- DropForeignKey
ALTER TABLE "PhysicalBook" DROP CONSTRAINT "PhysicalBook_authorId_fkey";

-- DropForeignKey
ALTER TABLE "PhysicalBook" DROP CONSTRAINT "PhysicalBook_categoryId_fkey";

-- AlterTable
ALTER TABLE "PhysicalBook" DROP COLUMN "authorId";
ALTER TABLE "PhysicalBook" DROP COLUMN "categoryId";

-- AddForeignKey
ALTER TABLE "_AuthorToPhysicalBook" ADD CONSTRAINT "_AuthorToPhysicalBook_A_fkey" FOREIGN KEY ("A") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuthorToPhysicalBook" ADD CONSTRAINT "_AuthorToPhysicalBook_B_fkey" FOREIGN KEY ("B") REFERENCES "PhysicalBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToPhysicalBook" ADD CONSTRAINT "_CategoryToPhysicalBook_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToPhysicalBook" ADD CONSTRAINT "_CategoryToPhysicalBook_B_fkey" FOREIGN KEY ("B") REFERENCES "PhysicalBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuthorToItem" ADD CONSTRAINT "_AuthorToItem_A_fkey" FOREIGN KEY ("A") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuthorToItem" ADD CONSTRAINT "_AuthorToItem_B_fkey" FOREIGN KEY ("B") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToItem" ADD CONSTRAINT "_CategoryToItem_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToItem" ADD CONSTRAINT "_CategoryToItem_B_fkey" FOREIGN KEY ("B") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;