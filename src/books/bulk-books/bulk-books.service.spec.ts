import { Test, TestingModule } from '@nestjs/testing';
import { BulkBooksService } from './bulk-books.service';

describe('BulkBooksService', () => {
  let service: BulkBooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BulkBooksService],
    }).compile();

    service = module.get<BulkBooksService>(BulkBooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
