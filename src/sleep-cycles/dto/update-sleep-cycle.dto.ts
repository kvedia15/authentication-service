import { PartialType } from '@nestjs/swagger';
import { CreateSleepCycleDto } from './create-sleep-cycle.dto';

export class UpdateSleepCycleDto extends PartialType(CreateSleepCycleDto) {}
