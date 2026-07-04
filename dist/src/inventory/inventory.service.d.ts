import { PrismaService } from 'prisma/prisma.service';
export declare class InventoryService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createInventoryDto: any): Promise<{
        item: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            code: string | null;
            totalStock: number;
            availableStock: number;
            status: import(".prisma/client").$Enums.ItemStatus;
            typeId: string;
        };
        message: string;
    }>;
    findAll(query: any): Promise<{
        data: ({
            type: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            code: string | null;
            totalStock: number;
            availableStock: number;
            status: import(".prisma/client").$Enums.ItemStatus;
            typeId: string;
        })[];
        totalPages: number;
    }>;
    findOne(id: string): string;
    edit(id: string, updateInventoryDto: any): Promise<{
        item: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            code: string | null;
            totalStock: number;
            availableStock: number;
            status: import(".prisma/client").$Enums.ItemStatus;
            typeId: string;
        };
        message: string;
    }>;
    delete(id: string): Promise<{
        item: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            code: string | null;
            totalStock: number;
            availableStock: number;
            status: import(".prisma/client").$Enums.ItemStatus;
            typeId: string;
        };
        message: string;
    }>;
}
