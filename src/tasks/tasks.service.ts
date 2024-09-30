import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Tasks } from './entity/tasks.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Tasks)
        private readonly tasksRepository:Repository<Tasks>
    ){}

    findAll(){
        return this.tasksRepository.find({relations:['user']});
    }

    findOne(id:number){
        return this.tasksRepository.findOne({where: {id:id},relations:['user']});
    }

    async createOne(body:CreateTaskDto){
        const {userId,data} = body;
        const user = await this.findOne(userId);
        if(!user){
            throw new NotFoundException('User not found');
        }

        const task = this.tasksRepository.create({
            data:data,
            user:user,
            done:false,
        });
        await this.tasksRepository.save(task);

        return task;
    }

    async updateOne(id:number,body:UpdateTaskDto){
        const {done,data} = body;
        const task = await this.findOne(id);
        if(!task){
            throw new NotFoundException('Task not found');
        }
        
        task.data = data;
        task.done = done;

        await this.tasksRepository.save(task);
        return task;
    }
}
