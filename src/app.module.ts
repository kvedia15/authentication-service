import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { SleepCyclesModule } from './sleep-cycles/sleep-cycles.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, UsersModule, SleepCyclesModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
