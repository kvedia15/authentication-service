import { Test, TestingModule } from '@nestjs/testing';
import { SleepCyclesController } from './sleep-cycles.controller';
import { SleepCyclesService } from './sleep-cycles.service';

describe('SleepCyclesController', () => {
  let controller: SleepCyclesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SleepCyclesController],
      providers: [SleepCyclesService],
    }).compile();

    controller = module.get<SleepCyclesController>(SleepCyclesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
