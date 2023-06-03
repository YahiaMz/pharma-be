import { IsEmail, IsString, MinLength } from "class-validator";

export class UserLoginDto {
    @IsEmail()
    email : string;

    @IsString()
    password : string;
}
