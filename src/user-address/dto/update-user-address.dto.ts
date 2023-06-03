import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreateUserAddressDto } from './create-user-address.dto';

export class UpdateUserAddressDto  {

    @IsString()
    @IsOptional()
    name : string ;

    @IsString() 
    @IsOptional()
    address : string;

}
