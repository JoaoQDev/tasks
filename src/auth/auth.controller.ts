import { Body, Controller, Head, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService:AuthService
    ){}

    @Post('/login')
    login(@Body() loginDto:LoginDto){
        return this.authService.login(loginDto);
    }

    @Post('/refresh')
    refresh(@Body() refreshTokenDto:RefreshTokenDto){
        console.log(refreshTokenDto);
        return this.authService.refreshTokens(refreshTokenDto);
    }
}
