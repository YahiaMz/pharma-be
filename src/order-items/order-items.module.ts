import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './entities/order-item.entity';
import { OrderItemsService } from './order-items.service';

@Module({
  providers: [OrderItemsService] , 
  imports : [TypeOrmModule.forFeature([OrderItem])] , 
  exports : [OrderItemsService]
})
export class OrderItemsModule {}
