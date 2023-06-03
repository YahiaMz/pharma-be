import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsPositive, Min } from 'class-validator';
import { AddProductToCartDto } from './add-product-to-cart.dto';

export class UpdateCartQuantityDto {
    @IsInt()
    @IsPositive()
    @Min(1)
    quantity : number;
}
