import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResponseState } from 'src/RespnoceState';
import { CartsService } from './carts.service';
import { AddProductToCartDto } from './dto/add-product-to-cart.dto';
import { UpdateCartQuantityDto  } from './dto/update-cart.dto';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post('/add')
 async addProductToCart(@Body() createCartDto: AddProductToCartDto) {
    let newItem = await this.cartsService.addProductToCart(createCartDto);
    return ResponseState.success_response(newItem);
   }

  @Get('/OfUser/:user_Id')
  async listCartOfUser( @Param('user_Id') user_Id : string ) {
    let cart = await this.cartsService.displayCartOfUser(+user_Id);
    return ResponseState.success_response(cart);

  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCartQuantityDto : UpdateCartQuantityDto) {
    let updatedCart = await this.cartsService.updateCartItemProductQuantity(+id, updateCartQuantityDto);
    return ResponseState.success_response(updatedCart);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.cartsService.remove(+id);
    return ResponseState.success_response('item removed with success !');
  }
}
