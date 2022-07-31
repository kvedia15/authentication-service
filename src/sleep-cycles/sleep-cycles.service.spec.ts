import { Test, TestingModule } from '@nestjs/testing';
import { SleepCyclesService } from './sleep-cycles.service';

describe('SleepCyclesService', () => {
  let service: SleepCyclesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SleepCyclesService],
    }).compile();

    service = module.get<SleepCyclesService>(SleepCyclesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
