import { Module } from '@nestjs/common';
import { AiInventoryService } from './ai-inventory.service';
import { AiInventoryController } from './ai-inventory.controller';
import { ConfigModule } from '@nestjs/config'
@Module({

  controllers: [AiInventoryController],
  providers: [AiInventoryService],
  imports: [
    ConfigModule
  ]
})
export class AiInventoryModule { }
