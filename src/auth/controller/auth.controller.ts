import { Body, CanActivate, Controller, ExecutionContext, Get, HttpException, HttpStatus, Injectable, Param, Post, Req, Res, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../service/auth.service";
import { UserEntity } from "src/user/models/user.entity";
import { AuthEntity } from "../auth.enity";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";



@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private authService: AuthService) { }


    @ApiOperation({
        summary: 'dang ky',
        description: 'user dang ky tk'
    })
    @ApiBody({
        type: UserEntity,
        examples: {
            user_1: {
                value: {
                    name: '1',
                    password: '1',
                    email: '1@gmail.com',
                    
                } as UserEntity,
            },
        },
    })
    @Post('signup')
    signup(@Body() user: UserEntity) {
        return this.authService.signUp(user);
    }
    @ApiOperation({
        summary:'dang nhap',
        description: 'dang nhap'
    })
    @ApiBody({
        type: AuthEntity,
        examples: {
            user_1: {
                value: {
                    name: '1',
                    password: '1',

                } as AuthEntity,
            },
        },
    })
    @Post('signin')
    signin(@Body() data: AuthEntity) {
        return this.authService.signIn(data);
    }


    @ApiOperation({
        summary: 'veryfy mail',
    })
    @Get('email/verify/:token')
    public async verifyEmail(@Param('token') param: string, @Req() req) {
        try {
            var isEmailVerified = await this.authService.verifyEmail(param);
            if(isEmailVerified){
                return { message: 'Email đã được xác thực thành công' };
            }
        } catch (error) {
            throw new HttpException('Lỗi khi xác thực email', HttpStatus.BAD_REQUEST);
        }
    }
}