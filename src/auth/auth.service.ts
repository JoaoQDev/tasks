import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { Repository } from 'typeorm';
import { Users } from 'src/users/entity/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingServiceProtocol } from './hashing/hashing.service';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

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

    async login(loginDto:LoginDto) {
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

        const { acessToken, refreshToken } = await this.createTokens(user);

        return {acessToken,refreshToken};
    }

    private async createTokens(user: Users) {
        const acessToken = await this.signJwtAsync<Partial<Users>>(
            user.id,
            this.jwtConfiguration.jwtTtl,
            { email: user.email}
        );

        const refreshToken = await this.signJwtAsync(
            user.id,
            this.jwtConfiguration.jwtRefreshTtl
        );
        return { acessToken, refreshToken };
    }

    private async signJwtAsync<T>(sub:number,expiresIn:number,payload?:T) {
        return await this.jwtService.signAsync(
            {
                sub,
                ...payload
            },
            {
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
                secret: this.jwtConfiguration.secret,
                expiresIn: expiresIn
            }
        );
    }

    async refreshTokens(refreshTokenDto:RefreshTokenDto){
        try {
            const {sub} = await this.jwtService.verifyAsync(
                refreshTokenDto.refreshToken,
                this.jwtConfiguration
            );
            const user = await this.usersRepository.findOneBy({
                id:sub
            });
            if(!user){
                throw new Error('User not found');
            }
            return this.createTokens(user);
        } catch (error) {
            throw new UnauthorizedException(error.message)
        }
    }
}
