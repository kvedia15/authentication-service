import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSleepCycleDto } from './dto/create-sleep-cycle.dto';
import { UpdateSleepCycleDto } from './dto/update-sleep-cycle.dto';
import { SleepCycle } from './entities/sleep-cycle.entity';

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

  
  findAll(userId: number) {
    return this.prisma.sleepCycle.findMany({ where: { userId } });
  }
  

  async getInfo(userId: number) {
    const sleepCycles=await this.prisma.sleepCycle.findMany({ where: { userId } })
    const hoursSlept:number[]=[]
    const sleepTimeHours:number[]=[]
    const wakeTimeHours:number[]=[]
    for (let sleepCycle of sleepCycles){
      const sleepTime=new Date(String(sleepCycle.sleepTime));
      const wakeTime=new Date(String(sleepCycle.wakeTime));
      const hours= Math.abs(wakeTime.getTime()-sleepTime.getTime())
      hoursSlept.push(hours/1000/60/60)
      sleepTimeHours.push(sleepTime.getHours())
      wakeTimeHours.push(wakeTime.getHours())
    }

    let counts = {}, max = 0, res;
    for (var v in sleepTimeHours) {
      counts[sleepTimeHours[v]] = (counts[sleepTimeHours[v]] || 0) + 1;
      if (counts[sleepTimeHours[v]] > max) { 
        max = counts[sleepTimeHours[v]];
        res = sleepTimeHours[v];
      }

    }
    const sleepTimeResults:number[] = [];
    for (var k in counts){
      if (counts[k] == max){
        sleepTimeResults.push(Number(k));
      }
    }

    counts = {}, max = 0, res;
    for (var v in wakeTimeHours) {
      counts[wakeTimeHours[v]] = (counts[wakeTimeHours[v]] || 0) + 1;
      if (counts[wakeTimeHours[v]] > max) { 
        max = counts[wakeTimeHours[v]];
        res = wakeTimeHours[v];
      }

    }
    const wakeTimeResults:number[] = [];
    for (var k in counts){
      if (counts[k] == max){
        wakeTimeResults.push(Number(k));
      }
    }

    const average = array => array.reduce((a, b) => a + b) / array.length;
    const avgHoursSlept=average(hoursSlept)
    const maxHoursSlept=Math.max(...hoursSlept)
    const minHoursSlept=Math.min(...hoursSlept)
    
    const response= {
      "averageHoursSlept":Number(avgHoursSlept.toFixed()),
      "maxHoursSlept":maxHoursSlept,
      "minHoursSlept":minHoursSlept,
      "sleepEventsRecorded":hoursSlept.length,
      "frequentSleepingHour":sleepTimeResults[0],
      "frequentWakingHour":wakeTimeResults[0]
    }
    return response;
  }


  async update(id: number, data:any) {
    return this.prisma.sleepCycle.update({where: 
    {
      id: id,
    },
    data: 
    {
      sleepTime: new Date(data["sleepTime"]),
      wakeTime: new Date(data["wakeTime"]),
      user: {
        connect: { id: data["userId"] },
      },
    }})
  }

  remove(id: number) {
    return this.prisma.sleepCycle.delete({where:{ id }});
  }
}
