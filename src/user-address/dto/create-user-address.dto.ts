import { IsInt, IsNumberString, IsPositive, IsString } from "class-validator";

export class CreateUserAddressDto {

    @IsString()
    name : string ;

    @IsString() 
    address : string;

    @IsNumberString()
    user_Id : number;

}
