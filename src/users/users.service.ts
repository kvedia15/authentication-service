import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {compare, hash} from 'bcrypt'
import {User} from '@prisma/client'


interface FormatLogin extends Partial<User> {
  username: string
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: {...(createUserDto),dateOfBirth:new Date(createUserDto.dateOfBirth),password: await hash(createUserDto.password, 10) } });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
  })}
  
  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  

  //use by auth module to get user in database
  findByPayload(username: any){
    return this.prisma.user.findUnique({
        where: { username }
    });
}

async findByLogin({username, password}: LoginUserDto):  
                                   Promise<FormatLogin> {
        const user = await this.prisma.user.findFirst({
            where: {username}
        });

        if (!user) {
            throw new HttpException("invalid_credentials",  
                  HttpStatus.UNAUTHORIZED);
        }

        // compare passwords
        const areEqual = await compare(password, user.password);

        if (!areEqual) {
            throw new HttpException("invalid_credentials",
                HttpStatus.UNAUTHORIZED);
        }

        const {password: p, ...rest} = user;
        return rest;
    }

}
