import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROUTE_POLICY_KEY } from "../auth.const";
import { RoutePolicies } from "../enum/route-policies.enum";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import jwtConfig from "../config/jwt.config";
import { ConfigType } from "@nestjs/config";
import { UsersService } from "src/users/users.service";


@Injectable()
export class RoutePoliceGuard implements CanActivate{
    constructor(
        private readonly reflector:Reflector,
        private readonly jwtService:JwtService,
        private readonly userService:UsersService
    ){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const routePolicyRequired = this.reflector.get<RoutePolicies | undefined>(
            ROUTE_POLICY_KEY,
            context.getHandler()
        );

        if(routePolicyRequired === RoutePolicies.user){
            return true;
        }
        else if(routePolicyRequired === RoutePolicies.admin){
            const token = this.extractTokenFromHeader(context.switchToHttp().getRequest());
            const decodedToken = await this.jwtService.decode(token);
            const user = await this.userService.findOne(decodedToken.sub);
            if(user.policy !== RoutePolicies.admin){
                throw new UnauthorizedException('Permission denied');
            }
        }
        else{
            return true;
        }
        
        console.log(routePolicyRequired);
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