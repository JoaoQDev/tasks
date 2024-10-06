import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateTaskDto {
    @IsString()
    @MaxLength(255)
    @IsNotEmpty()
    data: string;
}