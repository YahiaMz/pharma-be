import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ResponseState } from 'src/RespnoceState';
import { OrderItem } from 'src/order-items/entities/order-item.entity';
import { OrderItemDto } from './dto/order-item.dto';
import { OrderItemCartDto } from './dto/order-cart-item.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    
    let newOrder = await this.ordersService.create(createOrderDto);
    return ResponseState.success_response(newOrder);
  }


  @Post('/OfUser/:user_Id')
  async orderAllInMyCart(@Param('user_Id') user_Id : string , @Body() orderItemDto : OrderItemCartDto) {
    let newOrder = await this.ordersService.orderAllItemsInMyCart(+user_Id ,orderItemDto);
    return ResponseState.success_response(newOrder);
  }



  @Get()
  async findAll() {
    let orders = await this.ordersService.findAll();
    return ResponseState.success_response(orders);
  }

  @Get('/ofUser/:user_Id')
  async findActiveOrdersOfaUser(@Param('user_Id') id: string) {
    let activeOrders = await this.ordersService.findActiveOrdersOfUser(+id);
    return ResponseState.success_response(activeOrders);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
