import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncTokenGuard } from './sync-token.guard';

@Controller('sync')
@UseGuards(SyncTokenGuard)
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  /** Estado del servidor (sirve como "ping" autenticado). */
  @Get('info')
  info() {
    return this.syncService.info();
  }

  /** Descarga el snapshot completo del servidor. */
  @Get('export')
  export() {
    return this.syncService.exportAll();
  }

  /** Fusiona el snapshot del cliente (LWW) y devuelve el estado canónico. */
  @Post('merge')
  merge(@Body() payload: any) {
    return this.syncService.merge(payload);
  }
}
