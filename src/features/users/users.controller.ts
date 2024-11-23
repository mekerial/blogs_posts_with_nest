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
  UnauthorizedException,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { QueryUserInputModel } from '../../common/types';
import { CreateUserInputModelType } from './types/user.types';
import { HttpExceptionFilter } from '../../infrastructure/exception-filters/http-exception-filter';
import { BasicAuthGuard } from '../../infrastructure/guards/basic-auth.guard';

@UseFilters(HttpExceptionFilter)
@UseGuards(BasicAuthGuard)
@Controller('users')
export class UsersController {
  constructor(protected usersService: UsersService) {}

  @Get()
  async getUsers(@Query() sortData: QueryUserInputModel) {
    console.log('GET users/');
    return this.usersService.findUsers(sortData);
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    console.log('GET users/:id');

    const userId = id;
    return this.usersService.getUser(userId);
  }

  @Post()
  async createUser(@Body() inputModel: CreateUserInputModelType) {
    console.log('POST users');

    if (!inputModel.login || !inputModel.password || !inputModel.email) {
      throw new UnauthorizedException();
    }
    const createUser = await this.usersService.createUser(inputModel);
    if (!createUser) {
      throw new UnauthorizedException();
    }
    return createUser;
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id') userId: string) {
    console.log('DELETE users/:id');

    const deleteUser = await this.usersService.deleteUser(userId);
    if (!deleteUser) {
      throw new NotFoundException(`User with id: ${userId} not found`);
    }
    return deleteUser;
  }
}
