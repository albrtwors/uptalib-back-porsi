import { Test, TestingModule } from '@nestjs/testing';
import { AiInventoryController } from './ai-inventory.controller';
import { AiInventoryService } from './ai-inventory.service';

describe('AiInventoryController', () => {
  let controller: AiInventoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiInventoryController],
      providers: [AiInventoryService],
    }).compile();

    controller = module.get<AiInventoryController>(AiInventoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
