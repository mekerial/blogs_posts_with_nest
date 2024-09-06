import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { LoginInputModel } from './types/auth.types';
import { AuthService } from './auth.service';
import { HttpExceptionFilter } from '../../infrastructure/exception-filters/http-exception-filter';
import { CreateUserInputModelType } from '../users/types/user.types';
import { UsersService } from '../users/users.service';

@UseFilters(HttpExceptionFilter)
@Controller('auth')
export class AuthController {
  constructor(
    protected authService: AuthService,
    protected userService: UsersService,
  ) {}
  @Post('login')
  async userLogin(@Body() inputModel: LoginInputModel) {
    const accessToken = await this.authService.loginUser(inputModel);
    if (!accessToken) {
      throw new UnauthorizedException();
    }
    return { accessToken: accessToken };
  }
  @Post('registration')
  async registrationUser(@Body() inputModel: CreateUserInputModelType) {
    const regUser = await this.userService.registrateUser(inputModel);
    if (!regUser) {
      throw new Error();
    }
  }
}
