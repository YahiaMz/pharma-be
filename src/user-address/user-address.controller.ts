import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserAddressService } from './user-address.service';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
import { ResponseState } from 'src/RespnoceState';

@Controller('user-address')
export class UserAddressController {
  constructor(private readonly userAddressService: UserAddressService) {}

  @Post()
  create(@Body() createUserAddressDto: CreateUserAddressDto) {
    return this.userAddressService.create(createUserAddressDto);
  }

  @Get('/:user_Id')
 async findAll(@Param('user_Id') user_Id : string) {
    let addresses = await  this.userAddressService.findAll(+user_Id);
     return ResponseState.success_response(addresses);
  }

  @Patch(':id')
 async update(@Param('id') id: string, @Body() updateUserAddressDto: UpdateUserAddressDto) {
    let uAddress = await this.userAddressService.update(+id, updateUserAddressDto);
    return ResponseState.success_response(uAddress);

  }

  @Delete(':id')
 async remove(@Param('id') id: string) {
      await this.userAddressService.remove(+id);
      return ResponseState.success_response('address removed with success ');

    }
}
