import { Test, TestingModule } from '@nestjs/testing';
import { OfrecenController } from './ofrecen.controller';
import { OfrecenService } from './ofrecen.service';

describe('OfrecenController', () => {
  let controller: OfrecenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfrecenController],
      providers: [OfrecenService],
    }).compile();

    controller = module.get<OfrecenController>(OfrecenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
