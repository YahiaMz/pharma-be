import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseState } from 'src/RespnoceState';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
import { UserAddress } from './entities/user-address.entity';

@Injectable()
export class UserAddressService {
  
  private userService : UserService;

  constructor(@InjectRepository(UserAddress) private userAddressRepository : Repository<UserAddress> ,
        userService : UserService 
  ) {
    this.userService = userService;
  }
  
   async create(createUserAddressDto: CreateUserAddressDto) {
    let user = await this.userService.findUserByIdOrThrowException(createUserAddressDto.user_Id);
     try {
       let newAddress = this.userAddressRepository.create({name : createUserAddressDto.name , user : user , address : createUserAddressDto.address});
       return await this.userAddressRepository.save(newAddress);
      } catch (error) {
       throw new HttpException(ResponseState.failed_response('address name exist') , 201);
     }
 
  }


  async findAll(user_Id : number) {
    let user = await this.userService.findUserByIdOrThrowException(user_Id);

   try {
     let addresses = await this.userAddressRepository.find({user : user})
     return addresses;
   } catch (error) {
    throw new HttpException(ResponseState.failed_response('something wrong' + error.message) , 201);
   }
  }


  update(id: number, updateUserAddressDto: UpdateUserAddressDto) {
    return `This action updates a #${id} userAddress`;
  }
  
  async findUserAddressByIdOrThrowException ( userAddress_Id : number) { 
    try {
      let userAddress = await this.userAddressRepository.findOne({id : userAddress_Id});
       if(userAddress) return userAddress;
    } catch (error) {
      throw new HttpException(ResponseState.failed_response('something wrong' + error.message) , 201);
    }

    throw new HttpException(ResponseState.failed_response('address not found !') , 201);


  }


  async remove(id: number) {
       let address = await this.findUserAddressByIdOrThrowException(id);
        try {
          await this.userAddressRepository.remove(address);
          return ;
        } catch (error) {
          throw new HttpException(ResponseState.failed_response('something wrong while removing' + error.message) , 201);
        }
  }
}
