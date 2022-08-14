import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, ClassSerializerInterceptor,Request } from '@nestjs/common';
import { SleepCyclesService } from './sleep-cycles.service';
import { CreateSleepCycleDto } from './dto/create-sleep-cycle.dto';
import { UpdateSleepCycleDto } from './dto/update-sleep-cycle.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('Sleep Cycles')
@Controller('sleep-cycles')
export class SleepCyclesController {
  constructor(private readonly sleepCyclesService: SleepCyclesService) {}

  @UseGuards(JwtAuthGuard)
  @ApiSecurity('access-key')
  @ApiBearerAuth("Bearer")
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  create(@Request() req, @Body() createSleepCycleDto: CreateSleepCycleDto) {
    createSleepCycleDto["userId"]=req.user.id
    return this.sleepCyclesService.create(createSleepCycleDto);
  }


  @UseGuards(JwtAuthGuard)
  @ApiSecurity('access-key')
  @ApiBearerAuth("Bearer")
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('all')
  findAll(@Request() req) {
    return this.sleepCyclesService.findAll(+req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiSecurity('access-key')
  @ApiBearerAuth("Bearer")
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('info')
  getInfo(@Request() req) {
    return this.sleepCyclesService.getInfo(+req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiSecurity('access-key')
  @ApiBearerAuth("Bearer")
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  update(@Param('id') id: string,@Request() req, @Body() updateSleepCycleDto: UpdateSleepCycleDto) {
    updateSleepCycleDto["userId"]=req.user.id
    return this.sleepCyclesService.update(+id, updateSleepCycleDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiSecurity('access-key')
  @ApiBearerAuth("Bearer")
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sleepCyclesService.remove(+id);
  }

}
