import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService] , 
  imports : [TypeOrmModule.forFeature([Product]) , CategoriesModule] , 
  exports : [ProductsService]
})
export class ProductsModule {}
