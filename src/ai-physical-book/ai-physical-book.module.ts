import { Module } from '@nestjs/common';
import { AiPhysicalBookService } from './ai-physical-book.service';
import { AiPhysicalBookController } from './ai-physical-book.controller';
import { ConfigModule } from '@nestjs/config'
@Module({
  controllers: [AiPhysicalBookController],
  providers: [AiPhysicalBookService],
  imports: [ConfigModule]
})
export class AiPhysicalBookModule { }
