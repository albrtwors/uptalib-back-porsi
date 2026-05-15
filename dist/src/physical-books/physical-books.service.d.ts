import { CreatePhysicalBookDto } from './dto/create-physical-book.dto';
import { UpdatePhysicalBookDto } from './dto/update-physical-book.dto';
import { PrismaService } from 'prisma/prisma.service';
export declare class PhysicalBooksService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createPhysicalBookDto: CreatePhysicalBookDto): Promise<{
        status: string;
        message: string;
        data: {
            status: import(".prisma/client").$Enums.BookStatus;
            id: string;
            isbn: string | null;
            title: string;
            pnf: import(".prisma/client").$Enums.Pnf | null;
            yearOfPublication: number;
            editorial: string | null;
            totalStock: number;
            availableStock: number;
            createdAt: Date;
            updatedAt: Date;
            authorId: string;
            categoryId: string;
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
            status: import(".prisma/client").$Enums.BookStatus;
            id: string;
            isbn: string | null;
            title: string;
            pnf: import(".prisma/client").$Enums.Pnf | null;
            yearOfPublication: number;
            editorial: string | null;
            totalStock: number;
            availableStock: number;
            createdAt: Date;
            updatedAt: Date;
            authorId: string;
            categoryId: string;
        })[];
        totalPages: number;
    }>;
    findOne(id: number): string;
    update(id: string, updatePhysicalBookDto: UpdatePhysicalBookDto): Promise<{
        status: string;
        message: string;
        data: {
            difference: number;
            status: import(".prisma/client").$Enums.BookStatus;
            id: string;
            isbn: string | null;
            title: string;
            pnf: import(".prisma/client").$Enums.Pnf | null;
            yearOfPublication: number;
            editorial: string | null;
            totalStock: number;
            availableStock: number;
            createdAt: Date;
            updatedAt: Date;
            authorId: string;
            categoryId: string;
        };
    }>;
    remove(id: string): Promise<{
        status: string;
        message: string;
    }>;
}
