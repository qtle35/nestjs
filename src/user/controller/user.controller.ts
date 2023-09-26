import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Req, Res, Response, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserEntity } from '../models/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwtauth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/user_role/role.decorator';
import { Role } from 'src/user_role/role.enum';
import { RolesGuard } from 'src/auth/role.guard';

@ApiBearerAuth('JWT')
@ApiTags('users')
@Controller('users')
export class UserController {

    constructor(private userService: UserService) { }
    @UsePipes(new ValidationPipe())
    @ApiOperation({
        summary: 'test',
        description: `*mô tả`,
    })
    @Post()
    async add(@Body() user: UserEntity, @Response() res) {
        const addedUser = await this.userService.add(user);
        res.status(HttpStatus.CREATED).json(addedUser);
    }

    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@Req() { user }): Promise<UserEntity[]> {
        // console.log(user)
        return this.userService.findAll();
    }
    @Delete(':name')
    async deleteUser(@Param('name', ParseIntPipe) name: string, @Response() res) {
        try {
            await this.userService.delete(name);
            res.status(HttpStatus.OK).json({ message: 'xoa thanh cong' });
        } catch (error) {
            res.status(error.getStatus()).json({ message: error });
        }
    }
}