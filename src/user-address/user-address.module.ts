import { Module } from '@nestjs/common';
import { UserAddressService } from './user-address.service';
import { UserAddressController } from './user-address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAddress } from './entities/user-address.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [UserAddressController],
  providers: [UserAddressService] , 
  exports : [UserAddressService] ,
  imports : [TypeOrmModule.forFeature([UserAddress]) , UserModule]
})
export class UserAddressModule {}
