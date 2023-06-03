import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsInt, IsPort, IsPositive, Min } from "class-validator";
import { OrderItemDto } from "./order-item.dto";

export class CreateOrderDto {

    @IsInt()
    @IsPositive()
    user_Id : number;

    @IsArray()
    @ArrayMinSize(1)
    @Type(()=> OrderItemDto )
    items : OrderItemDto[]
    
}
