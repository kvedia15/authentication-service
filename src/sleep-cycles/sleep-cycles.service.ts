import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSleepCycleDto } from './dto/create-sleep-cycle.dto';
import { UpdateSleepCycleDto } from './dto/update-sleep-cycle.dto';

@Injectable()
export class SleepCyclesService {
  constructor(private prisma: PrismaService) {}

  async create(data:any) {
    return this.prisma.sleepCycle.create({data: {
      sleepTime: new Date(data["sleepTime"]),
      wakeTime: new Date(data["wakeTime"]),
      user: {
        connect: { id: data["userId"] },
      },
    },
   })}

  



  findAll() {
    return this.prisma.sleepCycle.findMany();
  }

  findOne(userId: number) {
    return this.prisma.sleepCycle.findMany({ where: { userId } });
  }

  update(id: number, updateSleepCycleDto: UpdateSleepCycleDto) {
    return `This action updates a #${id} sleepCycle`;
  }

  remove(id: number) {
    return `This action removes a #${id} sleepCycle`;
  }
}
