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
  findOne(@Request() req) {
    return this.sleepCyclesService.findOne(+req.user.id);
  }


  // @Get()
  // findAll() {
  //   return this.sleepCyclesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.sleepCyclesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSleepCycleDto: UpdateSleepCycleDto) {
  //   return this.sleepCyclesService.update(+id, updateSleepCycleDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.sleepCyclesService.remove(+id);
  // }

}
