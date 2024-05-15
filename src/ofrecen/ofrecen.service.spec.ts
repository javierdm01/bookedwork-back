import { Test, TestingModule } from '@nestjs/testing';
import { OfrecenService } from './ofrecen.service';

describe('OfrecenService', () => {
  let service: OfrecenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OfrecenService],
    }).compile();

    service = module.get<OfrecenService>(OfrecenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
