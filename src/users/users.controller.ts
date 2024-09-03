import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { QueryUserInputModel } from '../common/types';
import { CreateUserInputModelType } from './types/user.types';

@Controller('users')
export class UsersController {
  constructor(protected usersService: UsersService) {}
  @Get()
  async getUsers(@Query() sortData: QueryUserInputModel) {
    return this.usersService.findUsers(sortData);
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const userId = id;
    return this.usersService.getUser(userId);
  }
  @Post()
  async createUser(@Body() inputModel: CreateUserInputModelType) {
    const createUser = await this.usersService.createUser(inputModel);
    return createUser;
  }

  @Put(':id')
  async updateUser(
    @Param('id') userId: string,
    @Body() model: CreateUserInputModelType,
  ) {
    return {
      id: userId,
      model: model,
    };
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id') userId: string) {
    const deleteUser = await this.usersService.deleteUser(userId);
    if (!deleteUser) {
      throw new NotFoundException(`User with id: ${userId} not found`);
    }
    return deleteUser;
  }
}
