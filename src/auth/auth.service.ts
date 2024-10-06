import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { Repository } from 'typeorm';
import { Users } from 'src/users/entity/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingServiceProtocol } from './hashing/hashing.service';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Users)
        private readonly usersRepository:Repository<Users>,
        private readonly hashService:HashingServiceProtocol,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration:ConfigType<typeof jwtConfig>,
        private readonly jwtService:JwtService
    ){}

    async login(loginDto:LoginDto){
        let passwordIsValid = false;

        const user = await this.usersRepository.findOne({where: {email:loginDto.email}});
        if(!user){
            throw new NotFoundException('User not found');
        }

        passwordIsValid = await this.hashService.compare(
            loginDto.password,user.passwordHash
        );

        if(!passwordIsValid){
            throw new UnauthorizedException('User or password invalid');
        }

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

        return {acessToken};
    }
}
