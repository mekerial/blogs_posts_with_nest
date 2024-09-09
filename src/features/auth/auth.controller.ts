import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { LoginInputModel } from './types/auth.types';
import { AuthService } from './auth.service';
import { HttpExceptionFilter } from '../../infrastructure/exception-filters/http-exception-filter';
import {
  CreateUserInputModelType,
  InputConfirmationCodeModel,
  InputEmailModel,
  InputPasswordAndCode,
} from '../users/types/user.types';
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
    const regUser = await this.authService.registrateUser(inputModel);
    if (!regUser) {
      throw new Error();
    }
    return;
  }
  @Post('registration-email-resending')
  async regEmailResend(@Body() inputModel: InputEmailModel) {
    const resendEmail = await this.authService.resendEmailConfirm(inputModel);
    if (!resendEmail) {
      return BadRequestException;
    }
    return;
  }

  @Post('registration-confirmation')
  async confirmEmail(@Body() inputModel: InputConfirmationCodeModel) {
    const confirmEmail = await this.authService.confirmEmail(inputModel.code);
    if (!confirmEmail) {
      return BadRequestException;
    }
    return;
  }

  @Post('password-recovery')
  async passwordRecovery(@Body() inputEmail: InputEmailModel) {
    const passwordRecovery =
      await this.authService.passwordRecovery(inputEmail);
    if (!passwordRecovery) {
      return BadRequestException;
    }
    return;
  }
  @Post('new-password')
  async setNewPassword(@Body() inputData: InputPasswordAndCode) {
    const setNewPassword = await this.authService.setNewPassword(inputData);
    if (!setNewPassword) {
      return BadRequestException;

      return;
    }
  }
}
