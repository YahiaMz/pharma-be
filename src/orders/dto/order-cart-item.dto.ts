import { Type } from "class-transformer";
import {  IsIn, IsNumberString, IsPort, IsPositive, IsString, Min } from "class-validator";
import { OrderItemDto } from "./order-item.dto";

export class OrderItemCartDto {


    @IsNumberString( )
    address_Id : number;

    @IsString()
    @IsIn(['card' , 'cash'])
    paymentMethod : string;

    @IsString( )
    phoneNumber :string;

    @IsNumberString()
    shippingPrice : number;
    

}
