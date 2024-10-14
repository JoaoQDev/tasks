import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, SetMetadata, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entity/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { Request } from 'express';
import { REQ_USER_PAYLOAD, ROUTE_POLICY_KEY } from 'src/auth/auth.const';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenDto } from 'src/auth/dtos/token.dto';
import { RoutePoliceGuard } from 'src/auth/guards/route-police.guard';
import { SetRoutePolicy } from 'src/auth/decorators/set-route-policy.decorator';
import { RoutePolicies } from 'src/auth/enum/route-policies.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs/promises';


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
        console.log('hello');
        return this.userService.create(createUserDto);
    }
    
    @Patch('/')
    @UseGuards(RoutePoliceGuard)
    @UseGuards(AuthTokenGuard)
    @SetRoutePolicy(RoutePolicies.user)
    updateOne(@TokenPayloadParam() token:TokenDto,@Body() updateUserDto:UpdateUserDto){
        return this.userService.update(token.sub,updateUserDto);
    }

    @Delete('/')
    @UseGuards(RoutePoliceGuard)
    @UseGuards(AuthTokenGuard)
    @SetRoutePolicy(RoutePolicies.user)
    deleteOne(@TokenPayloadParam() token:TokenDto){
        return this.userService.delete(token.sub);
    }
    
    @Delete('/:id')
    @UseGuards(RoutePoliceGuard)
    @UseGuards(AuthTokenGuard)
    @SetRoutePolicy(RoutePolicies.admin)
    adminDeleteOne(@Param('id',ParseIntPipe) id:number){
        return this.userService.delete(id);
    }

    @Patch('/:id')
    @UseGuards(RoutePoliceGuard)
    @UseGuards(AuthTokenGuard)
    @SetRoutePolicy(RoutePolicies.admin)
    adminUpdateOne(@Param('id',ParseIntPipe) id:number,@Body() updateUserDto:UpdateUserDto){
        return this.userService.update(id,updateUserDto);
    }

    @Post('/upload-picture')
    @UseGuards(RoutePoliceGuard)
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(AuthTokenGuard)
    @SetRoutePolicy(RoutePolicies.user)
    upload(@UploadedFile() file:Express.Multer.File,@TokenPayloadParam() token:TokenDto){
        const mimeType = file.mimetype;
        const fileExtension = path.extname(file.originalname);
        console.log(fileExtension);

        return this.userService.upload(file,token);
    }
}
