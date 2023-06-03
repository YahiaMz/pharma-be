import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItemsModule } from 'src/order-items/order-items.module';
import { UserModule } from 'src/user/user.module';
import { ProductsModule } from 'src/products/products.module';
import { CartsModule } from 'src/carts/carts.module';
import { UserAddressModule } from 'src/user-address/user-address.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService] , 
  imports : [TypeOrmModule.forFeature([Order]) , OrderItemsModule ,UserAddressModule, UserModule ,ProductsModule , CartsModule]
})
export class OrdersModule {}
