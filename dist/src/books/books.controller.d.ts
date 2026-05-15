import { BookService } from './books.service';
export declare class BookController {
    private bookService;
    constructor(bookService: BookService);
    findAll(query: any): Promise<{
        data: {
            id: number;
            title: string;
            description: string | null;
            routepdf: string;
            routeimg: string | null;
            createAt: Date;
            updateAt: Date;
        }[];
        totalPages: number;
    }>;
    getMyLibrary(req: any, query: any): Promise<{
        data: ({
            book: {
                id: number;
                title: string;
                description: string | null;
                routepdf: string;
                routeimg: string | null;
                createAt: Date;
                updateAt: Date;
            };
        } & {
            id: number;
            userId: number;
            createdAt: Date;
            updatedAt: Date;
            saveeAt: Date;
            bookId: number;
        })[];
        totalPages: number;
    }>;
    findOne(id: number): Promise<{
        id: number;
        title: string;
        description: string | null;
        routepdf: string;
        routeimg: string | null;
        createAt: Date;
        updateAt: Date;
    }>;
    create(data: any, req: any, file: Express.Multer.File): Promise<{
        message: string;
    }>;
    delete(id: number, req: any): Promise<{
        book: {
            id: number;
            title: string;
            description: string | null;
            routepdf: string;
            routeimg: string | null;
            createAt: Date;
            updateAt: Date;
        };
        message: string;
    }>;
    edit(id: number, data: any, pdfFile: Express.Multer.File, req: any): Promise<{
        book: {
            id: number;
            title: string;
            description: string | null;
            routepdf: string;
            routeimg: string | null;
            createAt: Date;
            updateAt: Date;
        };
        message: string;
    }>;
    verifyLike(req: any, bookId: any): Promise<boolean>;
    removeLike(req: any, bookId: any): Promise<{
        message: string;
        data: {
            id: number;
            userId: number;
            createdAt: Date;
            updatedAt: Date;
            saveeAt: Date;
            bookId: number;
        }[];
    }>;
    save(req: any, bookId: number): Promise<{
        message: string;
        data: {
            id: number;
            userId: number;
            createdAt: Date;
            updatedAt: Date;
            saveeAt: Date;
            bookId: number;
        };
    }>;
}
