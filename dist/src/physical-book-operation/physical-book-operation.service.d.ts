import { CreatePhysicalBookOperationDto } from './dto/create-physical-book-operation.dto';
import { UpdatePhysicalBookOperationDto } from './dto/update-physical-book-operation.dto';
import { PrismaService } from 'prisma/prisma.service';
import { DropDto } from './dto/drop-dto';
import { EntrieDto } from './dto/entrie-dto';
import { LoanDto } from './dto/loan-dto';
export declare class PhysicalBookOperationService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllOperations(query: any): Promise<{
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
    addDrops(entriesDto: DropDto): Promise<{
        status: string;
        message: string;
    }>;
    addEntries(entriesDto: EntrieDto): Promise<{
        status: string;
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
    settle(id: string): Promise<{
        state: string;
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
    create(createPhysicalBookOperationDto: CreatePhysicalBookOperationDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updatePhysicalBookOperationDto: UpdatePhysicalBookOperationDto): string;
    remove(id: number): string;
}
