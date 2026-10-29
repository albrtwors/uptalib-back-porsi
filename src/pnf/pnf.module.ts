import { Module } from '@nestjs/common';
import { PnfController } from './pnf.controller';
import { PnfService } from './pnf.service';

@Module({
  controllers: [PnfController],
  providers: [PnfService],
})
export class PnfModule {}
