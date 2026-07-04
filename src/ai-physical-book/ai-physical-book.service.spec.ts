import { Test, TestingModule } from '@nestjs/testing';
import { AiPhysicalBookService } from './ai-physical-book.service';

describe('AiPhysicalBookService', () => {
  let service: AiPhysicalBookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiPhysicalBookService],
    }).compile();

    service = module.get<AiPhysicalBookService>(AiPhysicalBookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
