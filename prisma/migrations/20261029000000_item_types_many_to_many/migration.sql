-- CreateTable
CREATE TABLE "_ItemToItemType" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ItemToItemType_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ItemToItemType_B_index" ON "_ItemToItemType"("B");

-- AddForeignKey
ALTER TABLE "_ItemToItemType" ADD CONSTRAINT "_ItemToItemType_A_fkey" FOREIGN KEY ("A") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToItemType" ADD CONSTRAINT "_ItemToItemType_B_fkey" FOREIGN KEY ("B") REFERENCES "ItemType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Preserve the existing single type of every item.
INSERT INTO "_ItemToItemType" ("A", "B")
SELECT "id", "typeId" FROM "Item" WHERE "typeId" IS NOT NULL
ON CONFLICT DO NOTHING;

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_typeId_fkey";

-- DropForeignKey
ALTER TABLE "_AuthorToItem" DROP CONSTRAINT "_AuthorToItem_A_fkey";

-- DropForeignKey
ALTER TABLE "_AuthorToItem" DROP CONSTRAINT "_AuthorToItem_B_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToItem" DROP CONSTRAINT "_CategoryToItem_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToItem" DROP CONSTRAINT "_CategoryToItem_B_fkey";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "typeId";

-- DropTable
DROP TABLE "_AuthorToItem";

-- DropTable
DROP TABLE "_CategoryToItem";
