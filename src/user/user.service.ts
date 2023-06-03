import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpUserDto } from './dto/signup-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ResponseState } from 'src/RespnoceState';
import { UserLoginDto } from './dto/user-login.dto ';
import { UserLikeProductDto } from './dto/userLikeProductDto';
import { ProductsService } from 'src/products/products.service';


@Injectable()
export class UserService {
  constructor( @InjectRepository(User) private userRepository : Repository<User>   ,
               private productService : ProductsService
  ) { }

  saltOrRounds = 10;
  

  async signUp(createUserDto: SignUpUserDto ) {

    try {
      
      let hashedPassword = await bcrypt.hash(createUserDto.password , this.saltOrRounds);
      createUserDto.password = hashedPassword;
      let newUser  = await this.userRepository.save(createUserDto);
      delete newUser.password;
      return newUser;


    } catch (err) {
      throw new HttpException(
        ResponseState.failed_response('email exist') ,
        200
      )
    }

  }


  async login( loginUserDto : UserLoginDto){
   
    let user = await this.findUserByEmailOrThrowException(loginUserDto.email);
    try {
      let comparePasswordResult = await bcrypt.compare(loginUserDto.password , user.password);
      if(comparePasswordResult) {
        delete user.password;
        return user;
      }
    } catch (error) {
      throw new HttpException(
        ResponseState.failed_response('something wrong !') ,
        200
      )
    }


    throw new HttpException(
      ResponseState.failed_response('wrong email or password !') ,
      200
    )

  }



  async like( userLikeProductDto : UserLikeProductDto) { 

    let userWithHimLikes = await this.findUserLikesByIdOrThrowException(userLikeProductDto.user_Id); 
    let product = await this.productService.findProductByIdOrThrowException(+userLikeProductDto.product_Id);

    let isTheOperationUnLike = userWithHimLikes.likes.find(prd => prd.id == +userLikeProductDto.product_Id);
  


    try {
      if(isTheOperationUnLike) {
         let newLikeList = userWithHimLikes.likes.filter(elem => elem.id !== +userLikeProductDto.product_Id)
         userWithHimLikes.likes = newLikeList; 
         
      }else {
        userWithHimLikes.likes.push(product);
      }
     await this.userRepository.save(userWithHimLikes);

     return isTheOperationUnLike ? 'disliked' :  'liked';


    } catch (error) {
      
    }

  }




  async findAll() {
       
    try {
      let users = await this.userRepository.find({select : [ 'id' ,'fullName' , 'email', 'imageProfile' , 'phoneNumber']})
      return users;
    } catch (error) {
      throw new HttpException(
        ResponseState.failed_response('something wrong !') ,
        200
      )
    }

  }


  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }



  async remove(id: number) {
    let userToDelete = await this.findUserByIdOrThrowException(id) 
    try {
       await this.userRepository.delete(id);
       return ;
    } catch (error) {
      throw new HttpException(
        ResponseState.failed_response('something wrong !') ,
        200
      )
    }
  }


  async  findUserByIdOrThrowException ( userId : number ) { 
      try {
        let user = await this.userRepository.findOne({id :userId });
        if(user) { 
          return user;
        }
      } catch (error) {
        throw new HttpException(
          ResponseState.failed_response('something wrong while fetching this user') ,
          200
        ) ;
      }

      throw new HttpException(
        ResponseState.failed_response('oops user not found ') ,
        200
      )
  }

  async  findUserLikesByIdOrThrowException ( userId : number ) { 
    try {
      let user = await this.userRepository.findOne({id :userId } ,{relations : ['likes']});
      if(user) { 
        delete user.password
        return user;
      }
    } catch (error) {
      throw new HttpException(
        ResponseState.failed_response('something wrong while fetching this user') ,
        200
      ) ;
    }

    throw new HttpException(
      ResponseState.failed_response('oops user not found ') ,
      200
    )

    }

  async findUserByEmailOrThrowException ( email : string ) { 
    try {
      let user = await this.userRepository.findOne({email :email });
      if(user) { 
        return user;
      }
    } catch (error) {
      throw new HttpException(
        ResponseState.failed_response('something wrong while fetching this user') ,
        200
      ) ;
    }

    throw new HttpException(
      ResponseState.failed_response('oops user not found ') ,
      200
    )
}

}
