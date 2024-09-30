import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entity/users.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { PasswordHash } from 'src/utils/password-hash';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private readonly usersRepository:Repository<Users>,
        private readonly passwordHash:PasswordHash,
    ){}

    findAll(){
        return this.usersRepository.find({relations:['tasks']});
    }

    async findOne(id:number){
        const user = await this.usersRepository.findOne({where: {id:id},relations:['tasks']});
        if(!user || user === null){
             throw new NotFoundException('User not found');
        }
        return user;
    }

    async create(body:CreateUserDto){
      const {name,password,email} = body;
      const hash = await this.passwordHash.hashPassowrd(password);
      
      const user = await this.usersRepository.create({
        name,
        passwordHash:hash,
        email,
      })
      await this.usersRepository.save(user);
      return user;
    }

    async update(id:number,body:UpdateUserDto){
        const {name,password,email} = body;
        const hash = await this.passwordHash.hashPassowrd(password);
        const userExists = await this.findOne(id);
        if(!userExists){
            throw new NotFoundException('User not found');
        }
        const user = await this.usersRepository.preload({
            id:userExists.id,
            name:name,
            passwordHash:hash,
            email:email
        })
        await this.usersRepository.save(user);
        return user;
    }

    async delete(id:number){
        const user = await this.findOne(id);
        if(!user){
            throw new NotFoundException('User not found');
        }
        await this.usersRepository.delete(user.id);
        return this.findAll();
    }
}
