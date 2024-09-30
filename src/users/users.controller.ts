import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entity/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UsersController {
    constructor(
        private readonly userService:UsersService
    ){}

    @Get('/')
    findAll(){
       return this.userService.findAll()
    }

    @Get('/:id')
    findOne(@Param('id',ParseIntPipe) id:number){
        return this.userService.findOne(id)
    }

    @Post('/')
    createOne(@Body() createUserDto:CreateUserDto){
        return this.userService.create(createUserDto)
    }

    @Patch('/:id')
    updateOne(@Param('id',ParseIntPipe) id:number,@Body() updateUserDto:UpdateUserDto){
        return this.userService.update(id,updateUserDto)
    }

    @Delete('/:id')
    deleteOne(@Param('id',ParseIntPipe) id:number){
        return this.userService.delete(id)
    }
}
