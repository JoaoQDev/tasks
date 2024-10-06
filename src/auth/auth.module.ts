import { Global, Module } from '@nestjs/common';
import { HashingServiceProtocol } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/entity/users.entity';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthTokenGuard } from './guards/auth-token.guard';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([Users]),
        ConfigModule.forFeature(jwtConfig),
        JwtModule.registerAsync(jwtConfig.asProvider()),
    ],
    providers: [
        {  
            provide: HashingServiceProtocol,
            useClass: BcryptService,
        },
        AuthService
    ],
    exports: [HashingServiceProtocol,JwtModule,ConfigModule],
    controllers: [AuthController]
})
export class AuthModule {}
