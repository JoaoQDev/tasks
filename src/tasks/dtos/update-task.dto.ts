import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateTaskDto {

    @IsString()
    @IsOptional()
    data:string;

    @IsBoolean()
    @IsOptional()
    done: boolean;
}