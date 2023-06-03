import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports : [TypeOrmModule.forFeature([
    User
  ]) , ProductsModule] ,
  controllers: [UserController],
  providers: [UserService] ,
  exports : [UserService],
  
})
export class UserModule {} 
