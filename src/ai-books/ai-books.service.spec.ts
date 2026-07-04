import { Test, TestingModule } from '@nestjs/testing';
import { AiBooksService } from './ai-books.service';

describe('AiBooksService', () => {
  let service: AiBooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiBooksService],
    }).compile();

    service = module.get<AiBooksService>(AiBooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
