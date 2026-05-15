import { PhysicalBooksService } from './physical-books.service';
import { CreatePhysicalBookDto } from './dto/create-physical-book.dto';
import { UpdatePhysicalBookDto } from './dto/update-physical-book.dto';
export declare class PhysicalBooksController {
    private readonly physicalBooksService;
    constructor(physicalBooksService: PhysicalBooksService);
    create(createPhysicalBookDto: CreatePhysicalBookDto): Promise<{
        status: string;
        message: string;
        data: {
            id: string;
            title: string;
            createdAt: Date;
            updatedAt: Date;
            totalStock: number;
            availableStock: number;
            status: import(".prisma/client").$Enums.BookStatus;
            isbn: string | null;
            yearOfPublication: number;
            authorId: string;
            categoryId: string;
            pnf: import(".prisma/client").$Enums.Pnf | null;
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
            totalStock: number;
            availableStock: number;
            status: import(".prisma/client").$Enums.BookStatus;
            isbn: string | null;
            yearOfPublication: number;
            authorId: string;
            categoryId: string;
            pnf: import(".prisma/client").$Enums.Pnf | null;
            editorial: string | null;
        })[];
        totalPages: number;
    }>;
    findOne(id: string): string;
    update(id: string, updatePhysicalBookDto: UpdatePhysicalBookDto): Promise<{
        status: string;
        message: string;
        data: {
            difference: number;
            id: string;
            title: string;
            createdAt: Date;
            updatedAt: Date;
            totalStock: number;
            availableStock: number;
            status: import(".prisma/client").$Enums.BookStatus;
            isbn: string | null;
            yearOfPublication: number;
            authorId: string;
            categoryId: string;
            pnf: import(".prisma/client").$Enums.Pnf | null;
            editorial: string | null;
        };
    }>;
    remove(id: string): Promise<{
        status: string;
        message: string;
    }>;
}
