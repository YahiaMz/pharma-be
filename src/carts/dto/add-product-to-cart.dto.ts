import { IsInt, IsNumberString, IsPositive, Min } from "class-validator";

export class AddProductToCartDto {

    @IsNumberString() 
    user_Id : number;

    @IsNumberString() 
    product_Id : number;

    @IsNumberString() 
    quantity : number;
    

}
