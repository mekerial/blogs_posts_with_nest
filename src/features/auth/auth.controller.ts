import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  Req,
  Res,
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
import { Response, Request } from 'express';
import { SecurityService } from '../security/security.service';

@UseFilters(HttpExceptionFilter)
@Controller('auth')
export class AuthController {
  constructor(
    protected authService: AuthService,
    protected securityService: SecurityService,
  ) {}
  @Post('login')
  @HttpCode(200)
  async userLogin(
    @Body() inputModel: LoginInputModel,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const deviceTitle = request.headers['user-agent'] || 'new device';
    const ip = request.ip || 'no ip';

    const auth = await this.authService.loginUser(inputModel, deviceTitle, ip);
    if (!auth) {
      throw new UnauthorizedException();
    }
    response.cookie('refreshToken', auth.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    response.cookie('deviceId', auth.deviceId, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return { accessToken: auth.accessToken };
  }
  @Post('registration')
  @HttpCode(204)
  async registrationUser(@Body() inputModel: CreateUserInputModelType) {
    const regUser = await this.authService.registrateUser(inputModel);
    if (!regUser) {
      throw new Error();
    }
    return;
  }
  @Post('registration-email-resending')
  @HttpCode(204)
  async regEmailResend(@Body() inputModel: InputEmailModel) {
    const resendEmail = await this.authService.resendEmailConfirm(inputModel);
    if (!resendEmail) {
      throw new BadRequestException([
        {
          message: 'incorrect email',
          field: 'email',
        },
      ]);
    }
    return;
  }

  @Post('registration-confirmation')
  @HttpCode(204)
  async confirmEmail(@Body() inputModel: InputConfirmationCodeModel) {
    const confirmEmail = await this.authService.confirmEmail(inputModel.code);
    if (!confirmEmail.flag) {
      throw new BadRequestException([
        {
          message: 'incorrect ' + confirmEmail.key,
          field: confirmEmail.key,
        },
      ]);
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
    }
    return;
  }

  @Post('logout')
  async logoutUser(@Req() request: Request) {
    const refreshToken = request.cookies.refreashToken;

    const logout =
      await this.securityService.deleteSessionByRefreshToken(refreshToken);
    if (!logout) {
      return NotFoundException;
    }
    return;
  }
}
