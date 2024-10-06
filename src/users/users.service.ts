import { Inject, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entity/users.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { HashingServiceProtocol } from 'src/auth/hashing/hashing.service';
import { plainToInstance } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/auth/config/jwt.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private readonly usersRepository:Repository<Users>,
        private readonly hashPassword:HashingServiceProtocol,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration:ConfigType<typeof jwtConfig>,
        private readonly jwtService:JwtService,
    ){}

    async findAll(){
       const user = await this.usersRepository.find({relations:['tasks']});
       return plainToInstance(Users,user);
    }

    async findOne(id:number){
        const user = await this.usersRepository.findOne({where: {id:id},relations:['tasks']});
        if(!user || user === null){
             throw new NotFoundException('User not found');
        }
        return plainToInstance(Users,user);
    }

    async create(body:CreateUserDto){
      const {name,password,email} = body;
      const userExists = await this.usersRepository.findOne({where: {email:email}});
      if(userExists){
        throw new Error('User exists.')
      }
      const hash = await this.hashPassword.hash(password);
      const user = await this.usersRepository.create({
        name,
        passwordHash:hash,
        email,
      })
      await this.usersRepository.save(user);
      const acessToken = await this.jwtService.signAsync(
        {
            sub: user.id,
            email:user.email
        },
        {
            audience: this.jwtConfiguration.audience,
            issuer: this.jwtConfiguration.issuer,
            secret: this.jwtConfiguration.secret,
            expiresIn: this.jwtConfiguration.jwtTtl
        }
      )
      return [
        {
            user
        },
        {
            "acessToken": acessToken
        }
      ];
    }

    async update(id:number,body:UpdateUserDto){
        const dataUser = {
            name: body?.name
        };
        if(body?.newPassword && body?.currentPassword){
            const user = await this.usersRepository.findOne({where: {id:id}});
            if(!user){
                throw new NotFoundException('User not found');
            }
            const userPassword:string = user.passwordHash;
            console.log(user);
            const isPasswordMatching = await this.hashPassword.compare(body.currentPassword,userPassword);
            if(!isPasswordMatching){
                throw new NotAcceptableException('Passwords dont match')
            }
            const hash = await this.hashPassword.hash(body.newPassword);
            dataUser['passwordHash'] = hash;
        }

        const user = await this.usersRepository.preload({
            id,
            ...dataUser
        });

        if(!user){
            throw new NotFoundException('User not exists');
        }

        await this.usersRepository.save(user);
        return user;
    }

    async delete(id:number){
        const user = await this.findOne(id);
        await this.usersRepository.delete(user.id);
        return this.findAll();
    }
}
