import { Module } from '@nestjs/common';
import { SleepCyclesService } from './sleep-cycles.service';
import { SleepCyclesController } from './sleep-cycles.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [SleepCyclesController],
  providers: [SleepCyclesService],
  imports: [PrismaModule],
})
export class SleepCyclesModule {}
