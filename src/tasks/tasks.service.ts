import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Tasks } from './entity/tasks.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { UsersService } from 'src/users/users.service';
import { TokenDto } from 'src/auth/dtos/token.dto';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Tasks)
        private readonly tasksRepository:Repository<Tasks>,
        private readonly userService:UsersService
    ){}

    findAll(){
        return this.tasksRepository.find({relations:['user']});
    }

    async findOne(id:number){
        const user = await this.tasksRepository.findOne({where: {id:id},relations:['user']});
        if(!user){
            throw new NotFoundException('User not exists');
        }
        return user
    }

    async createOne(id:number,body:CreateTaskDto){
        const {data} = body;
        const user = await this.userService.findOne(id);
        console.log(user);
        const task = this.tasksRepository.create({
            data:data,
            user:user,
            done:false,
        });
        await this.tasksRepository.save(task);

        return task;
    }

    async updateOne(id:number,body:UpdateTaskDto,token:TokenDto){
        const {done,data} = body;
        const task = await this.findOne(id);

        if(task.user.id !== token.sub){
            throw new UnauthorizedException('This task dont belongs to you')
        }
        
        task.data = data;
        task.done = done;

        await this.tasksRepository.save(task);
        return task;
    }

    async deleteOne(id:number,token:TokenDto){
        const task = await this.findOne(id);
        if(task.user.id !== token.sub){
            throw new UnauthorizedException('This task dont belongs to you')
        }
        await this.tasksRepository.delete(task);
        return this.findAll()
    }
}
