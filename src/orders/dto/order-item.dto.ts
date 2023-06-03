import { IsInt, IsPositive, Min } from "class-validator";

export class OrderItemDto {
    @IsInt()
    @IsPositive()
    product_Id : number;

    @IsInt()
    @IsPositive()
    @Min(1)
    quantity : number;
}