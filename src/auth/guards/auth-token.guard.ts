import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { ConfigType } from "@nestjs/config";
import jwtConfig from "../config/jwt.config";
import { REQ_USER_PAYLOAD } from "../auth.const";

@Injectable()
export class AuthTokenGuard implements CanActivate{
    constructor(
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration:ConfigType<typeof jwtConfig>,
        private readonly jwtService:JwtService,
    ){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request:Request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if(!token){
            throw new UnauthorizedException('Unauthenticated user');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token,this.jwtConfiguration);
            request[REQ_USER_PAYLOAD] = payload
        }
        catch (error) {
            console.log(error);
            throw new UnauthorizedException('Invalid Token');
        }
        return true;
    }

    extractTokenFromHeader(request:Request):string | undefined {
        const authorization = request.headers?.authorization;
        if(!authorization || typeof authorization !== 'string'){
            return undefined;
        }
        return authorization.split(' ')[1];
    } 
}