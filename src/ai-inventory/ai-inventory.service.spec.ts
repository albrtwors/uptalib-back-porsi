import { Test, TestingModule } from '@nestjs/testing';
import { AiInventoryService } from './ai-inventory.service';

describe('AiInventoryService', () => {
  let service: AiInventoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiInventoryService],
    }).compile();

    service = module.get<AiInventoryService>(AiInventoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
