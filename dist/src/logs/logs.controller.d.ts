import { LogsService } from './logs.service';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
export declare class LogsController {
    private readonly logsService;
    constructor(logsService: LogsService);
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
    findOne(id: string): string;
    update(id: string, updateLogDto: UpdateLogDto): string;
    remove(id: string): string;
}
