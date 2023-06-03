import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/entities/category.entity';
import { OrdersModule } from './orders/orders.module';
import { Product } from './products/entities/product.entity';
import { ProductsModule } from './products/products.module';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { OrderItemsModule } from './order-items/order-items.module';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './order-items/entities/order-item.entity';
import { CartsModule } from './carts/carts.module';
import { Cart } from './carts/entities/cart.entity';
import { UserAddressModule } from './user-address/user-address.module';
import { UserAddress } from './user-address/entities/user-address.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
     type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'Yahia', 
      password: 'AzerbB14916;',
      database: 'online-pharmacy-db',
      entities: [User , Category , Product , Order ,OrderItem , Cart , UserAddress],
      synchronize: true,
}), UserModule, AdminModule, ProductsModule, CategoriesModule, OrdersModule, OrderItemsModule, CartsModule, UserAddressModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
