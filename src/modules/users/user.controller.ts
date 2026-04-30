import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponse, UsersResponse } from 'src/shared/interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { USERS } from 'src/shared/constants/message.constant';
import { UpdateUserDto } from './dto/update-user.dto';
import { Types } from 'mongoose';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<UsersResponse> {
    const users = await this.userService.getAllUsers();
    return {
      message: USERS.FETCH_USERS_SUCCESS,
      data: users,
    };
  }

  @Get(':_id')
  async getUserBYId(@Param('_id') _id: Types.ObjectId): Promise<UserResponse> {
    const user = await this.userService.getUserBYId(_id);
    return {
      message: USERS.FETCH_USER_SUCCESS,
      data: user,
    };
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    const user = await this.userService.createUser(createUserDto);
    return {
      message: USERS.CREATE_USER_SUCCESS,
      data: user,
    };
  }

  @Put(':_id')
  async updateUser(
    @Param('_id') _id: Types.ObjectId,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    const user = await this.userService.updateUser({ ...updateUserDto, _id });
    return {
      message: USERS.UPDATE_USER_SUCCESS,
      data: user,
    };
  }

  @Delete(':_id')
  async deleteUser(@Param('_id') _id: Types.ObjectId): Promise<UserResponse> {
    await this.userService.deleteUser(_id);
    return {
      message: USERS.DELETE_USER_SUCCESS,
      data: null,
    };
  }
}
