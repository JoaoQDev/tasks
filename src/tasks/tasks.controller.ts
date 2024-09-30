import { Body, Controller, Get, Param, ParseBoolPipe, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';

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

    @Post('')
    createOne(@Body() body:CreateTaskDto){
        return this.taskService.createOne(body);
    }
    
    @Patch('/:id')
    updateOne(@Param('id',ParseIntPipe) id:number,@Body() body:UpdateTaskDto){
        return this.taskService.updateOne(id,body);
    }
    
}
