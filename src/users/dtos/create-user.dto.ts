import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { RoutePolicies } from "src/auth/enum/route-policies.enum";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    name: string; 

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    password: string;

    @IsEmail()
    email: string;
}