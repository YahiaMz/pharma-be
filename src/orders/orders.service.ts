import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartsService } from 'src/carts/carts.service';
import { OrderItemModel } from 'src/order-items/Models/orderItem.model';
import { OrderItemsService } from 'src/order-items/order-items.service';
import { ProductsService } from 'src/products/products.service';
import { ResponseState } from 'src/RespnoceState';
import { UserAddress } from 'src/user-address/entities/user-address.entity';
import { UserAddressService } from 'src/user-address/user-address.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { LessThan, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItemCartDto } from './dto/order-cart-item.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {

  constructor(@InjectRepository(Order) private orderRepository : Repository<Order> , 
           private productService :ProductsService , 
           private userService  : UserService , 
           private userAddressService  : UserAddressService , 
           private orderItemService : OrderItemsService , 
           private cartService : CartsService
  ){

  }

  async create(createOrderDto: CreateOrderDto) {
    let user = await this.userService.findUserByIdOrThrowException(createOrderDto.user_Id);
    let newOrder = await this.createJustOrder(user);
    try {
      
      for (let x = 0 ; x < createOrderDto.items.length ; x ++ ) {
        let product =  await this.productService.findProductByIdOrThrowException(createOrderDto.items[x].product_Id);


        let orderItemModelToCreateOrderItem = new OrderItemModel(newOrder , product , createOrderDto.items[x].quantity);
        let newOrderItemForThisOrder = await this.orderItemService.create(orderItemModelToCreateOrderItem);
      }
       
      delete newOrder.user.password;
      return newOrder;
       
    } catch (error) {
      await this.orderRepository.remove(newOrder);
      throw new HttpException( ResponseState.failed_response('something wrong ' + error.message) , 201);
    }

  }

  async orderAllItemsInMyCart(user_Id : number , orderItemsDto : OrderItemCartDto) {
    let user = await this.userService.findUserByIdOrThrowException(user_Id);
    let userAddress = await this.userAddressService.findUserAddressByIdOrThrowException(orderItemsDto.address_Id);
    
    let cartItemsOfThisUser = await this.cartService.displayCartOfUserForCreatingOrder(user);
    

    if (cartItemsOfThisUser.length == 0 ) { 
      throw new HttpException( ResponseState.failed_response('there is no item in this cart'), 200);
    }
    let newOrder = await this.orderRepository.save({
      user : user , 
      userAddress : userAddress , 
      paymentMethod : orderItemsDto.paymentMethod , 
      phoneNumber : orderItemsDto.phoneNumber ,
      shippingPrice : orderItemsDto.shippingPrice
    });
 
    delete newOrder.user.password;

    try {
      
     let orderItems = [];
    for ( let x = 0 ;x<cartItemsOfThisUser.length ; x ++ ) {
      
      if (cartItemsOfThisUser[x].quantity > cartItemsOfThisUser[x].product.quantityInStock ) {          
         throw new HttpException(`item ${cartItemsOfThisUser[x].product.name } is out of stock` , 400);
        }

      let orderItemsModule = new OrderItemModel(newOrder , cartItemsOfThisUser[x].product , cartItemsOfThisUser[x].quantity);
      let newOrderItem = await this.orderItemService.create(orderItemsModule);
      delete newOrderItem.product.quantityInStock;
      await this.productService.updateQuantity(cartItemsOfThisUser[x].product.id ,  - cartItemsOfThisUser[x].quantity );
      orderItems.push( {product : newOrderItem.product , quantity : newOrderItem.quantity  } );
      await this.cartService.remove(cartItemsOfThisUser[x].id);      
        
    }

      newOrder['items'] = orderItems;
      return newOrder; 

      } catch (error) {
        delete newOrder.items;
        await this.orderRepository.remove(newOrder);
        throw new HttpException( ResponseState.failed_response(`Oops something wrong : errorMessage = ${error.message}`) , 201);  
      }
    
  }


async  findAll() {
  
  try {
    let allOrders = await this.orderRepository.find( {where : {isActive : true} , relations : ['user']} );
    for (let x = 0 ; x < allOrders.length ; x++) { 
       delete allOrders[x].user.password;
       delete allOrders[x].user.created_at;
       delete allOrders[x].user.updated_at;

       let itemsOfThisOrder = await this.orderRepository.query(`
        SELECT orderItems.quantity as 'orderItemQuantity', products.id as 'product_Id', products.name , products.description , products.price  , products.imageUrl
        from orderItems inner join products  on
        products.id = orderItems.product_Id 
        where orderItems.order_Id = ${allOrders[x].id}
       `) 
       allOrders[x]['items'] = itemsOfThisOrder;
       
      }

    return allOrders;  
  } catch (error) {
    throw new HttpException( ResponseState.failed_response('something wrong') , 201);
  }
  
  }

  async findActiveOrdersOfUser(user_Id: number) {
    
    let user = await this.userService.findUserByIdOrThrowException(user_Id);

    try {
      let allActiveOrdersOfUser = await this.orderRepository.find( {where : {isActive : true , user : user} , order : {
        created_at : 'DESC'
      } ,  relations: ["userAddress"] } );
      for (let x = 0 ; x < allActiveOrdersOfUser.length ; x++) { 
        
         let itemsOfThisOrder = await this.orderRepository.query(`
          SELECT orderItems.id , orderItems.quantity as 'orderItemQuantity', products.id as 'product_Id', products.name , products.description , products.price  , products.imageUrl
          from orderItems inner join products  on
          products.id = orderItems.product_Id 
          where orderItems.order_Id = ${allActiveOrdersOfUser[x].id}
         
         `);

         let totalPrice : number = 0;

         for( let y : number = 0 ; y < itemsOfThisOrder.length ; y++) {
           totalPrice += itemsOfThisOrder[y].price;
         }


         
         allActiveOrdersOfUser[x]['totalPrice'] = totalPrice;
         allActiveOrdersOfUser[x]['items'] = itemsOfThisOrder;
         
        }
  
      return allActiveOrdersOfUser;  
    } catch (error) {
      throw new HttpException( ResponseState.failed_response('something wrong') , 201);
    }
    

  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }


  public async createJustOrder(user : User) {
    try {
   
      let newOrder =  this.orderRepository.create({user : user});
      return await this.orderRepository.save(newOrder);
   
    } catch (error) {
       throw new HttpException( ResponseState.failed_response('something wrong') , 201);
    }
  }

}
