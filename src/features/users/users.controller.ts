import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { QueryUserInputModel } from '../../common/types';
import { CreateUserInputModelType } from './types/user.types';
import { HttpExceptionFilter } from '../../infrastructure/exception-filters/http-exception-filter';

@UseFilters(HttpExceptionFilter)
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
