import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpUserDto } from './dto/signup-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseState } from 'src/RespnoceState';
import { UserLoginDto } from './dto/user-login.dto ';
import { UserLikeProductDto } from './dto/userLikeProductDto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  async signUp(@Body() signUpUserDto: SignUpUserDto) {
    let newUser = await this.userService.signUp(signUpUserDto);
    return ResponseState.success_response(newUser);
  }


  @Post('/login')
  async login(@Body() UserLoginDto: UserLoginDto) {
    let user = await this.userService.login(UserLoginDto);
    return ResponseState.success_response(user);
  }



  @Post('/like')
  async like(@Body() userLikeProductDto: UserLikeProductDto) {
    let user = await this.userService.like(userLikeProductDto);
    return ResponseState.success_response(user);
  }



  @Get('/:user_Id/likes')
  async userLikes(@Param('user_Id') user_Id : string ) {
    let user = await this.userService.findUserLikesByIdOrThrowException(+user_Id);
    return ResponseState.success_response(user);
  }


  @Get()
  async findAll() {
    let users = await  this.userService.findAll();
    return ResponseState.success_response(users);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.userService.remove(+id);
    return ResponseState.success_response('user deleted with success !');
  }
}
