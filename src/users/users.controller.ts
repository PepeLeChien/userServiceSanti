import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { userDto } from './dto/userDto';
import { UsersEntity } from './users.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { OrGuard } from './auth/or.guard';


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService){}

    @UseGuards(JwtAuthGuard)
    @Get()
    getUsers(): Promise<UsersEntity[] | null>{
        return this.usersService.getAllUsers();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':user_id')
    getUserById(@Param('user_id') id: number): Promise<UsersEntity | null>{
        return this.usersService.getUser(id);
    }


    @UseGuards(OrGuard)
    @Get('phone/:phone')
    getUserByPhone(@Param('phone') phone: string): Promise<UsersEntity | null>{
        return this.usersService.getUserByPhone(phone);
    }

    @UseGuards(JwtAuthGuard)
    @Get('dni/:dni')
    async getUserByDni(@Param('dni') dni: string): Promise<UsersEntity | null>{
        return this.usersService.getUserByDni(dni);
    }

    @UseGuards(JwtAuthGuard)
    @Get('verify/:phone')
    async verifyUserByPhone(@Param('phone') phone: string): Promise<boolean>{
        const user = await this.usersService.getUserByPhone(phone);
        console.log(user);
        if (!user) return false;
        return true;
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createUser(@Body() userDto: userDto, @Req() req: any) {
    
    const token = req.headers.authorization?.replace("Bearer ", "");

    await this.usersService.createUser(userDto, token);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':user_id')
    async updateUser(@Param('user_id') user_id: number, @Body() body: any){
        await this.usersService.updateUser(body, user_id)
    }

}
