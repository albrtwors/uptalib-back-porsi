import { CreateInventoryOperationDto } from './dto/create-inventory-operation.dto';
import { UpdateInventoryOperationDto } from './dto/update-inventory-operation.dto';
import { PrismaService } from 'prisma/prisma.service';
import { LoanDto } from './dto/loan-dto';
import { EntrieDto } from './dto/entrie-dto';
import { DropDto } from './dto/drop-dto';
export declare class InventoryOperationService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createInventoryOperationDto: CreateInventoryOperationDto): string;
    addDrops(entriesDto: DropDto): Promise<{
        status: string;
        message: string;
    }>;
    addEntries(entriesDto: EntrieDto): Promise<{
        status: string;
        message: string;
    }>;
    loan(itemLoan: LoanDto): Promise<{
        status: string;
        message: string;
    }>;
    settle(id: string): Promise<{
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
    findOne(id: number): string;
    update(id: number, updateInventoryOperationDto: UpdateInventoryOperationDto): string;
    remove(id: number): string;
}
