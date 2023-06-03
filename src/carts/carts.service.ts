import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import { ResponseState } from 'src/RespnoceState';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { AddProductToCartDto } from './dto/add-product-to-cart.dto';
import { UpdateCartQuantityDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartsService {



  constructor(@InjectRepository(Cart) private cartRepository : Repository<Cart>  , 
  private productService :ProductsService , 
  private userService  : UserService , 

  ) { }


  private async doesThisProductExistInThisUserCart ( product : Product , user : User  ) {
      try {
        let isExist = await this.cartRepository.findOne({
          where : {
            user : user,
            product : product
          }
        });

           if(isExist) {
             return isExist;
           }

      } catch (error) {
        throw new HttpException( ResponseState.failed_response('something wrong while testing the exist') , 201);
      }    

      return null;
   }


  async addProductToCart(createCartDto: AddProductToCartDto) {
   
    let user = await this.userService.findUserByIdOrThrowException(createCartDto.user_Id);
    let product = await this.productService.findProductByIdOrThrowException(createCartDto.product_Id);
 
    let isExist = await this.doesThisProductExistInThisUserCart(product , user);
    
    console.log( parseInt(createCartDto.quantity.toString() , 10));
    

    if( parseInt(createCartDto.quantity.toString() , 10) < 0 && isExist.quantity  == 1) {
      throw new HttpException( ResponseState.failed_response(`you cant make an order with 0 quantity `) , 201);      
    }

    try {
      
    
    if(isExist){ 
      
      isExist.quantity  += parseInt(createCartDto.quantity.toString() , 10);
      await this.cartRepository.save(isExist);
      return isExist ;
   
    } else {
      let newItem =  this.cartRepository.create({
        product : product , 
        user : user , 
        quantity : createCartDto.quantity
      });

      await this.cartRepository.save(newItem);
      delete newItem.user;
      return newItem ;
    }


  } catch (error) { 
    throw new HttpException( ResponseState.failed_response(`something wrong , error = ${error.message} `) , 201);

  }



  }

  async displayCartOfUser( user_Id : number ) {
    let user = await this.userService.findUserByIdOrThrowException(user_Id);
    try {
      let cartItems = await this.cartRepository.find({
        where : {
          user : user,
        } , 
        relations : ['product']
       
      });
      
      return cartItems;

    } catch (error) {
      throw new HttpException( ResponseState.failed_response('something wrong') , 201);
    }
  }

  async displayCartOfUserForCreatingOrder( user : User ) {
    try {
      let cartItems = await this.cartRepository.find({
        where : {
          user : user,
        } , 
        relations : ['product']
       
      });
      
      return cartItems;

    } catch (error) {
      throw new HttpException( ResponseState.failed_response('something wrong') , 201);
    }
  }

  async findCartItemByIdOrThrowException(id: number) {
   try {
     let cart : Cart = await this.cartRepository.findOne({id : id});
     if(cart) { 
       return cart;
     }
   } catch (error) {
    throw new HttpException( ResponseState.failed_response('something wrong') , 201);
   };

   throw new HttpException( ResponseState.failed_response('Oop cart item not found !') , 201);

  }

async updateCartItemProductQuantity(id: number, updateCartDto: UpdateCartQuantityDto) {
   let cartItem = await this.findCartItemByIdOrThrowException(id);
   try {
     cartItem.quantity = updateCartDto.quantity;
     return await this.cartRepository.save(cartItem);
   } catch (error) {
    throw new HttpException( ResponseState.failed_response('something wrong') , 201);
   }

  }

 async remove(id: number) {
   let cartItem = await this.findCartItemByIdOrThrowException(id);
    try {
    await this.cartRepository.remove(cartItem); 
    return ;
  } catch (error) {
  throw new HttpException( ResponseState.failed_response('something wrong') , 201); 
  } 
  }
}
