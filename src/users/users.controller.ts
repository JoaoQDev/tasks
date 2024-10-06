import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entity/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { Request } from 'express';
import { REQ_USER_PAYLOAD } from 'src/auth/auth.const';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenDto } from 'src/auth/dtos/token.dto';

@UseGuards(AuthTokenGuard)
@Controller('users')
export class UsersController {
    constructor(
        private readonly userService:UsersService
    ){}

    @Get('/')
    findAll(){
       return this.userService.findAll();
    }

    @Get('/:id')
    findOne(@Param('id',ParseIntPipe) id:number){
        return this.userService.findOne(id);
    }

    @Post('/')
    createOne(@Body() createUserDto:CreateUserDto){
        return this.userService.create(createUserDto);
    }

    @Patch('/')
    updateOne(@TokenPayloadParam() token:TokenDto,@Body() updateUserDto:UpdateUserDto){
        return this.userService.update(token.sub,updateUserDto);
    }

    @Delete('/')
    deleteOne(@TokenPayloadParam() token:TokenDto){
        return this.userService.delete(token.sub);
    }
}
