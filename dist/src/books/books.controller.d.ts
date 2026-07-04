import { BookService } from './books.service';
export declare class BookController {
    private bookService;
    constructor(bookService: BookService);
    findAll(query: any): Promise<{
        data: ({
            pnfs: {
                id: string;
                createdAt: Date;
                pnf: import(".prisma/client").$Enums.Pnf;
                bookId: number;
            }[];
            authors: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
            }[];
        } & {
            id: number;
            title: string;
            description: string | null;
            routepdf: string;
            routeimg: string | null;
            createAt: Date;
            updateAt: Date;
        })[];
        totalPages: number;
    }>;
    getMyLibrary(req: any, query: any): Promise<{
        data: ({
            book: {
                pnfs: {
                    id: string;
                    createdAt: Date;
                    pnf: import(".prisma/client").$Enums.Pnf;
                    bookId: number;
                }[];
                authors: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                }[];
            } & {
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
            bookId: number;
            saveeAt: Date;
        })[];
        totalPages: number;
    }>;
    findOne(id: number): Promise<{
        pnfs: {
            id: string;
            createdAt: Date;
            pnf: import(".prisma/client").$Enums.Pnf;
            bookId: number;
        }[];
        authors: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: number;
        title: string;
        description: string | null;
        routepdf: string;
        routeimg: string | null;
        createAt: Date;
        updateAt: Date;
    }>;
    create(data: {
        title: string;
        routepdf: string;
        pnfs?: string[];
        authorIds?: string[];
        [key: string]: any;
    }, req: any): Promise<{
        message: string;
        book: {
            id: number;
            title: string;
            description: string | null;
            routepdf: string;
            routeimg: string | null;
            createAt: Date;
            updateAt: Date;
        };
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
    update(id: number, data: {
        title?: string;
        routepdf?: string;
        pnfs?: string[];
        authorIds?: string[];
        [key: string]: any;
    }, req: any): Promise<{
        book: {
            pnfs: {
                id: string;
                createdAt: Date;
                pnf: import(".prisma/client").$Enums.Pnf;
                bookId: number;
            }[];
            authors: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
            }[];
        } & {
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
    verifyLike(req: any, bookId: number): Promise<boolean>;
    removeLike(req: any, bookId: number): Promise<{
        message: string;
        data: {
            id: number;
            userId: number;
            createdAt: Date;
            updatedAt: Date;
            bookId: number;
            saveeAt: Date;
        }[];
    }>;
    save(req: any, bookId: number): Promise<{
        message: string;
        data: {
            id: number;
            userId: number;
            createdAt: Date;
            updatedAt: Date;
            bookId: number;
            saveeAt: Date;
        };
    }>;
}
