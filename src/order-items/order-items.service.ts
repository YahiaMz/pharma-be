import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { ResponseState } from 'src/RespnoceState';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { OrderItemModel } from './Models/orderItem.model';

@Injectable()
export class OrderItemsService {

  constructor( @InjectRepository(OrderItem) private orderItemRepository : Repository<OrderItem> ) {}

 async create( orderItemModel : OrderItemModel ) {
  
  try {
 
    let newOrderItem = this.orderItemRepository.create({
      order : orderItemModel.order , 
      product : orderItemModel.product , 
      quantity : orderItemModel.quantity
    })
  
    return await this.orderItemRepository.save(newOrderItem);
    
  } catch (error) {
    throw new HttpException ('error101' + error.message, 201);
  }
  
 
  }

  async findAll(order : Order ) {
    
    let orderItems = await this.orderItemRepository.find({
      relations : ['products']
      ,
      where : {
        order : order
      }
    })

  }

}
