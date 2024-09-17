import { IsNotEmpty, IsString } from "class-validator";

export class CreateHookDto {
    @IsNotEmpty()
    @IsString()
    name: string;
    
    @IsNotEmpty()
    @IsString()
    branch: string;
    
    @IsNotEmpty()
    @IsString()
    pipeline: string;
}

