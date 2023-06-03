import { IsDecimal, IsIn, IsInt, IsNumberString, IsObject, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateProductDto {

    @IsString()
    name : string;

    @IsOptional()
    @IsString()
    description : string;

    @IsNumberString()
    price : number;

    @IsNumberString()
    category_Id : number;

    @IsNumberString()
    quantityInStock : number;

}
