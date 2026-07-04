import { PrismaService } from '../../prisma/prisma.service';
interface BookCreateInput {
    title: string;
    description?: string;
    routepdf: string;
    routeimg?: string;
    pnfs?: string[];
    authorIds?: string[];
}
interface BookUpdateInput {
    title?: string;
    description?: string;
    routepdf?: string;
    routeimg?: string;
    pnfs?: string[];
    authorIds?: string[];
}
export declare class BookService {
    private prisma;
    constructor(prisma: PrismaService);
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
    create(data: BookCreateInput, req: any): Promise<{
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
    edit(id: number, data: BookUpdateInput, req: any): Promise<{
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
    saveToUser(userId: number, bookId: number): Promise<{
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
    removeFromUser(userId: number, bookId: number): Promise<{
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
    getVerifyLike(userId: any, bookId: any): Promise<boolean>;
    getSavedBooks(userId: number, query: any): Promise<{
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
}
export {};
