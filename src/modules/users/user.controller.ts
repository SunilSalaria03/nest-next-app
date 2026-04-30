import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponse, UsersResponse } from 'src/shared/interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { USERS } from 'src/shared/constants/message.constant';
import { UpdateUserDto } from './dto/update-user.dto';
import { Types } from 'mongoose';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRole } from 'src/shared/enums/enums';

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async getAllUsers(): Promise<UsersResponse> {
    const users = await this.userService.getAllUsers();
    return {
      message: USERS.FETCH_USERS_SUCCESS,
      data: users,
    };
  }

  @Get(':_id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async getUserBYId(@Param('_id') _id: Types.ObjectId): Promise<UserResponse> {
    const user = await this.userService.getUserBYId(_id);
    return {
      message: USERS.FETCH_USER_SUCCESS,
      data: user,
    };
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    const user = await this.userService.createUser(createUserDto);
    return {
      message: USERS.CREATE_USER_SUCCESS,
      data: user,
    };
  }

  @Put(':_id')
  @Roles(UserRole.ADMIN)
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
  @Roles(UserRole.ADMIN)
  async deleteUser(@Param('_id') _id: Types.ObjectId): Promise<UserResponse> {
    await this.userService.deleteUser(_id);
    return {
      message: USERS.DELETE_USER_SUCCESS,
      data: null,
    };
  }
}
