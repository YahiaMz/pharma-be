import { IsEmail, IsString, Length, MinLength } from "class-validator";

export class SignUpUserDto {


    @IsString()
    @MinLength(3)
    fullName : string;

    @IsEmail()
    email : string;

    @IsString()
    @MinLength(6)
    password : string;

    @IsString()
    @Length(10)
    phoneNumber : string;

}
