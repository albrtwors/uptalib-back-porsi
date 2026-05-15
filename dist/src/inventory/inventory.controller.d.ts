import { InventoryService } from './inventory.service';
import { EditItemInventory } from './dto/edit-item-dto';
import { CreateInventoryDto } from './dto/create-inventory.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    create(createInventoryDto: CreateInventoryDto, img: Express.Multer.File): Promise<{
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
    edit(id: string, updateInventoryDto: EditItemInventory): Promise<{
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
