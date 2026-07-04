import { PrismaService } from 'prisma/prisma.service';
export declare class PhysicalBooksService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createPhysicalBookDto: any): Promise<{
        status: string;
        message: string;
        data: {
            id: string;
            title: string;
            createdAt: Date;
            updatedAt: Date;
            pnf: import(".prisma/client").$Enums.Pnf | null;
            totalStock: number;
            availableStock: number;
            status: import(".prisma/client").$Enums.BookStatus;
            isbn: string | null;
            yearOfPublication: number;
            authorId: string;
            categoryId: string;
            editorial: string | null;
        };
    }>;
    update(id: string, updatePhysicalBookDto: any): Promise<{
        status: string;
        message: string;
        data: {
            id: string;
            title: string;
            createdAt: Date;
            updatedAt: Date;
            pnf: import(".prisma/client").$Enums.Pnf | null;
            totalStock: number;
            availableStock: number;
            status: import(".prisma/client").$Enums.BookStatus;
            isbn: string | null;
            yearOfPublication: number;
            authorId: string;
            categoryId: string;
            editorial: string | null;
        };
    }>;
    findAll(query: any): Promise<{
        data: ({
            category: {
                id: string;
                name: string;
            };
            author: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            title: string;
            createdAt: Date;
            updatedAt: Date;
            pnf: import(".prisma/client").$Enums.Pnf | null;
            totalStock: number;
            availableStock: number;
            status: import(".prisma/client").$Enums.BookStatus;
            isbn: string | null;
            yearOfPublication: number;
            authorId: string;
            categoryId: string;
            editorial: string | null;
        })[];
        totalPages: number;
    }>;
    remove(id: string): Promise<{
        status: string;
        message: string;
    }>;
}
