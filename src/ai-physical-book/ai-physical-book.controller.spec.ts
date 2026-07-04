import { Test, TestingModule } from '@nestjs/testing';
import { AiPhysicalBookController } from './ai-physical-book.controller';
import { AiPhysicalBookService } from './ai-physical-book.service';

describe('AiPhysicalBookController', () => {
  let controller: AiPhysicalBookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiPhysicalBookController],
      providers: [AiPhysicalBookService],
    }).compile();

    controller = module.get<AiPhysicalBookController>(AiPhysicalBookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
