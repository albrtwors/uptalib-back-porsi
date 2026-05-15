import { PrismaService } from 'prisma/prisma.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventory } from './dto/update-inventory.dto';
export declare class InventoryService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createInventoryDto: CreateInventoryDto): Promise<{
        item: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            typeId: string;
            code: string | null;
            totalStock: number;
            availableStock: number;
            status: import(".prisma/client").$Enums.ItemStatus;
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
            typeId: string;
            code: string | null;
            totalStock: number;
            availableStock: number;
            status: import(".prisma/client").$Enums.ItemStatus;
        })[];
        totalPages: number;
    }>;
    findOne(id: string): string;
    edit(id: string, updateInventoryDto: UpdateInventory): Promise<{
        item: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            typeId: string;
            code: string | null;
            totalStock: number;
            availableStock: number;
            status: import(".prisma/client").$Enums.ItemStatus;
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
            typeId: string;
            code: string | null;
            totalStock: number;
            availableStock: number;
            status: import(".prisma/client").$Enums.ItemStatus;
        };
        message: string;
    }>;
}
