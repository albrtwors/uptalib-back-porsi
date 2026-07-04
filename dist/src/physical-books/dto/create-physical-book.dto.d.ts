import { Pnf } from "@prisma/client";
export declare class CreatePhysicalBookDto {
    title: string;
    isbn?: string;
    yearOfPublication: number;
    authorId?: string;
    authorName?: string;
    categoryId?: string;
    categoryName?: string;
    pnf: Pnf;
    editorial: string;
    totalStock: number;
}
