import { Test, TestingModule } from '@nestjs/testing';
import { PhysicalBookOperationController } from './physical-book-operation.controller';
import { PhysicalBookOperationService } from './physical-book-operation.service';

describe('PhysicalBookOperationController', () => {
  let controller: PhysicalBookOperationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhysicalBookOperationController],
      providers: [
        {
          provide: PhysicalBookOperationService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<PhysicalBookOperationController>(PhysicalBookOperationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
