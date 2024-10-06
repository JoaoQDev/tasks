import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto{
    @IsString()
    @IsOptional()
    @MinLength(5)
    name: string; 

    @IsString()
    @IsOptional()
    @MinLength(5)
    currentPassword: string;
    
    @IsString()
    @IsOptional()
    @MinLength(5)
    newPassword: string;
}