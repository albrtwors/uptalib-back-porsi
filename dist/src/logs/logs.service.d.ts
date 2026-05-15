import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { PrismaService } from 'prisma/prisma.service';
export declare class LogsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createLogDto: CreateLogDto): string;
    findAll(query: any): Promise<{
        data: ({
            user: {
                id: number;
                email: string;
                name: string;
                password: string;
                isBlocked: boolean;
                role: import(".prisma/client").$Enums.Role;
            };
        } & {
            id: string;
            userId: number;
            action: string;
            ip: string | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
        totalPages: number;
    }>;
    findOne(id: number): string;
    update(id: number, updateLogDto: UpdateLogDto): string;
    remove(id: number): string;
}
