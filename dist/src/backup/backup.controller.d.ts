import { Response } from 'express';
import { BackupService } from './backup.service';
export declare class BackupController {
    private readonly backupService;
    constructor(backupService: BackupService);
    downloadBackup(res: Response): Promise<void>;
}
