import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { Cart } from './entities/cart.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from 'src/products/products.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [CartsController],
  providers: [CartsService] , 
  imports : [TypeOrmModule.forFeature([Cart]) , ProductsModule , UserModule] ,
  exports : [CartsService]
})
export class CartsModule {}
