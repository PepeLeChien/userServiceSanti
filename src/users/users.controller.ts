import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { userDto } from './dto/userDto';
import { UsersEntity } from './users.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService){}

    @Get()
    getUsers(): Promise<UsersEntity[] | null>{
        return this.usersService.getAllUsers();
    }

    @Get(':user_id')
    getUserById(@Param('user_id') id: number): Promise<UsersEntity | null>{
        return this.usersService.getUser(id);
    }

    @Get('phone/:phone')
    getUserByPhone(@Param('phone') phone: string): Promise<UsersEntity | null>{
        return this.usersService.getUserByPhone(phone);
    }

    @Get('verify/:phone')
    async verifyUserByPhone(@Param('phone') phone: string): Promise<boolean>{
        const user = await this.usersService.getUserByPhone(phone);
        console.log(user);
        if (!user) return false;
        return true;
    }

    @Post()
    async createUser(@Body() userDto: userDto){
        await this.usersService.createUser(userDto);
    }

    
    @Patch(':user_id')
    async updateUser(@Param('user_id') user_id: number, @Body() body: any){
        await this.usersService.updateUser(body, user_id)
    }

}
