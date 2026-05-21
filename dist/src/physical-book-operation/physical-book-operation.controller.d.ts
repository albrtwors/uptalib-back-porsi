import { PhysicalBookOperationService } from './physical-book-operation.service';
import { UpdatePhysicalBookOperationDto } from './dto/update-physical-book-operation.dto';
import { EntrieDto } from './dto/entrie-dto';
import { DropDto } from './dto/drop-dto';
import { LoanDto } from './dto/loan-dto';
export declare class PhysicalBookOperationController {
    private readonly physicalBookOperationService;
    constructor(physicalBookOperationService: PhysicalBookOperationService);
    findAll(quer: any): Promise<{
        totalPages: number;
        data: {
            id: string;
            bookId: string;
            type: import(".prisma/client").$Enums.OperationType;
            quantity: number;
            observations: string | null;
            personId: string | null;
            wasSettled: boolean | null;
            personNames: string;
            personSurNames: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    addEntries(entriesDto: EntrieDto): Promise<{
        status: string;
        message: string;
    }>;
    addDrops(entriesDto: DropDto): Promise<{
        status: string;
        message: string;
    }>;
    loan(makeLoanDto: LoanDto): Promise<{
        state: string;
        message: string;
        loan: {
            id: string;
            bookId: string;
            type: import(".prisma/client").$Enums.OperationType;
            quantity: number;
            observations: string | null;
            personId: string | null;
            wasSettled: boolean | null;
            personNames: string;
            personSurNames: string;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    settle(id: any): Promise<{
        state: string;
        message: string;
    }>;
    findAllLoans(query: any): Promise<{
        data: {
            id: string;
            bookId: string;
            type: import(".prisma/client").$Enums.OperationType;
            quantity: number;
            observations: string | null;
            personId: string | null;
            wasSettled: boolean | null;
            personNames: string;
            personSurNames: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        totalPages: number;
    }>;
    findOne(id: string): string;
    update(id: string, updatePhysicalBookOperationDto: UpdatePhysicalBookOperationDto): string;
    remove(id: string): string;
}
