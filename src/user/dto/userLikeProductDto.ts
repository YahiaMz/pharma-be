import { IsNumberString } from "class-validator";

export class UserLikeProductDto {

    @IsNumberString()
    user_Id : number;

    @IsNumberString()
    product_Id : number;

}