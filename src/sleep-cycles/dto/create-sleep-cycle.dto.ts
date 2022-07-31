import { ApiProperty } from "@nestjs/swagger";

export class CreateSleepCycleDto {
    @ApiProperty({ required: true })
    sleepTime: Date;   
    @ApiProperty({ required: true })
    wakeTime: Date;
    // @ApiProperty({ required: true })
    // userId: Number;
}
