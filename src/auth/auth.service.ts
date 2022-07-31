import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {JwtPayload} from "./jwt.strategy";
import {User} from '@prisma/client'
import {hash} from "bcrypt";
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto, LoginUserDto } from 'src/users/dto/create-user.dto';

export interface RegistrationStatus{
    success: boolean;
    message: string;
    data?: User;
}

export interface RegistrationSeederStatus {
    success: boolean;
    message: string;
    data?: User[];
}

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
    ) {}

    async register(userDto: CreateUserDto): Promise<RegistrationStatus> {
        let status: RegistrationStatus = {
            success: true,
            message: "ACCOUNT_CREATE_SUCCESS",
        };

        try {
            status.data = await this.usersService.create(userDto);
        } catch (err) {
            status = {
                success: false,
                message: err,
            };
        }
        return status;
    }

    async validateUser(payload: JwtPayload): Promise<any> {
        const user = await this.usersService.findByPayload(payload.username);
        if (!user) {
            throw new HttpException("INVALID_TOKEN", 
               HttpStatus.UNAUTHORIZED);
        }
        return user;
    }

    private _createToken({ username }): any {
        const user: JwtPayload = { username };
        const Authorization = this.jwtService.sign(user);
        return {
            expiresIn: process.env.EXPIRESIN,
            Authorization,
        };
    }
    
    async login(loginUserDto: LoginUserDto): Promise<any> {
        // find user in db
        const user = await this.usersService.findByLogin(loginUserDto);

        // generate and sign token
        const token = this._createToken(user);

        return {
            ...token,
            data: user
        };
    }
    
    }

    