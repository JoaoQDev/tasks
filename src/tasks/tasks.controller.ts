import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenDto } from 'src/auth/dtos/token.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { ConfigType } from '@nestjs/config';
import jwtConfig from 'src/auth/config/jwt.config';

@UseGuards(AuthTokenGuard)
@Controller('tasks')
export class TasksController {
    constructor(
        private readonly taskService:TasksService,
    ){}

    @Get('/')
    findAll(){
        return this.taskService.findAll();
    }

    @Get('/:id')
    findOne(@Param('id',ParseIntPipe) id:number){
        return this.taskService.findOne(id);
    }

    @Post('/')
    createOne(@TokenPayloadParam() token:TokenDto,@Body() body:CreateTaskDto){
        return this.taskService.createOne(token.sub,body);
    }
    
    @Patch('/:id')
    updateOne(@Param('id',ParseIntPipe) id:number,@Body() body:UpdateTaskDto,@TokenPayloadParam() token:TokenDto){
        return this.taskService.updateOne(id,body,token);
    }
    @Delete('/:id')
    removeOne(@Param('id',ParseIntPipe) id:number,@TokenPayloadParam() token:TokenDto){
        return this.taskService.deleteOne(id,token);
    }
    
}
