import { InventoryOperationService } from './inventory-operation.service';
import { CreateInventoryOperationDto } from './dto/create-inventory-operation.dto';
import { UpdateInventoryOperationDto } from './dto/update-inventory-operation.dto';
import { EntrieDto } from './dto/entrie-dto';
import { DropDto } from './dto/drop-dto';
import { LoanDto } from './dto/loan-dto';
export declare class InventoryOperationController {
    private readonly inventoryOperationService;
    constructor(inventoryOperationService: InventoryOperationService);
    addEntries(entriesDto: EntrieDto): Promise<{
        status: string;
        message: string;
    }>;
    addDrops(entriesDto: DropDto): Promise<{
        status: string;
        message: string;
    }>;
    findAllLoans(query: any): Promise<{
        data: ({
            item: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                code: string | null;
                description: string | null;
                totalStock: number;
                availableStock: number;
                typeId: string;
                status: import(".prisma/client").$Enums.ItemStatus;
            };
        } & {
            id: string;
            itemId: string;
            type: import(".prisma/client").$Enums.OperationType;
            quantity: number;
            observations: string | null;
            personId: string | null;
            wasSettled: boolean | null;
            personNames: string;
            personSurNames: string;
            createdAt: Date;
            updatedAt: Date;
        })[];
        totalPages: number;
    }>;
    loan(itemLoan: LoanDto): Promise<{
        status: string;
        message: string;
    }>;
    settle(id: string): Promise<{
        status: string;
        message: string;
    }>;
    create(createInventoryOperationDto: CreateInventoryOperationDto): string;
    findAll(query: any): Promise<{
        data: ({
            item: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                code: string | null;
                description: string | null;
                totalStock: number;
                availableStock: number;
                typeId: string;
                status: import(".prisma/client").$Enums.ItemStatus;
            };
        } & {
            id: string;
            itemId: string;
            type: import(".prisma/client").$Enums.OperationType;
            quantity: number;
            observations: string | null;
            personId: string | null;
            wasSettled: boolean | null;
            personNames: string;
            personSurNames: string;
            createdAt: Date;
            updatedAt: Date;
        })[];
        totalPages: number;
    }>;
    findOne(id: string): string;
    update(id: string, updateInventoryOperationDto: UpdateInventoryOperationDto): string;
    remove(id: string): string;
}
