import {
    Controller,
    Get,
    Res,
    Headers,
    UnauthorizedException,
} from '@nestjs/common';

import { Response } from 'express';
import { BackupService } from './backup.service';

@Controller('backup')
export class BackupController {
    constructor(
        private readonly backupService: BackupService,
    ) { }

    @Get()
    async downloadBackup(


        @Res() res: Response,
    ) {


        const file =
            await this.backupService.generateBackup();

        const filename = `backup-${new Date().toISOString()
            }.json.gz`;

        res.set({
            'Content-Type': 'application/gzip',
            'Content-Disposition':
                `attachment; filename="${filename}"`,
            'Content-Length': file.length,
        });

        res.end(file);
    }
}