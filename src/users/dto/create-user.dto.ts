import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';


export class LoginUserDto {
    @ApiProperty({ required: true })
    readonly username: string;

    @ApiProperty({ required: true })
    readonly password: string;
}



export class CreateUserDto {

    @ApiProperty({ required: true })
    username: string;

    @ApiProperty({ required: true })
    password: string;

    @ApiProperty({ required: true })
    email: string;
    
    @ApiProperty({ required: true })
    firstName: string;

    @ApiProperty({ required: true })
    lastName: string;
    
    @ApiProperty({ required: true })
    dateOfBirth : Date

}

export class UpdatePasswordDto{
    @ApiProperty() 
    new_password: string;

    @ApiProperty() 
    old_password: string;
}
