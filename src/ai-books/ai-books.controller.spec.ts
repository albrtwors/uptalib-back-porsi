import { Test, TestingModule } from '@nestjs/testing';
import { AiBooksController } from './ai-books.controller';
import { AiBooksService } from './ai-books.service';

describe('AiBooksController', () => {
  let controller: AiBooksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiBooksController],
      providers: [AiBooksService],
    }).compile();

    controller = module.get<AiBooksController>(AiBooksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
