import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseFilters,
  UseGuards,
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
import { UsersService } from '../users/users.service';
import { AuthGuard } from '../../infrastructure/guards/auth.guard';
import { JwtService } from '../../applications/jwt/jwt.service';
import { Throttle } from '@nestjs/throttler';

@UseFilters(HttpExceptionFilter)
@Controller('auth')
export class AuthController {
  constructor(
    protected authService: AuthService,
    protected securityService: SecurityService,
    protected userService: UsersService,
    protected jwtService: JwtService,
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

  @Get('me')
  @UseGuards(AuthGuard)
  async getMePage(@Req() request: Request) {
    const user = await this.userService.getUser(request.userId.toString());

    const userInfo = {
      email: user.accountData.email,
      login: user.accountData.login,
      userId: user._id,
    };
    return userInfo;
  }

  @Throttle({ default: { limit: 5, ttl: 10000 } })
  @Post('registration')
  @HttpCode(204)
  async registrationUser(@Body() inputModel: CreateUserInputModelType) {
    const regUser = await this.authService.registrateUser(inputModel);
    if (!regUser) {
      throw new Error();
    }
    return;
  }

  @Throttle({ default: { limit: 5, ttl: 10000 } })
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

  @Throttle({ default: { limit: 5, ttl: 10000 } })
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

  @Throttle({ default: { limit: 5, ttl: 10000 } })
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

  @HttpCode(204)
  @Post('logout')
  async logoutUser(@Req() request: Request) {
    const refreshToken = request.cookies.refreshToken;

    const revokeRefreshToken =
      await this.jwtService.revokeRefreshToken(refreshToken);

    if (!revokeRefreshToken) {
      throw new UnauthorizedException();
    }
    const logout =
      await this.securityService.deleteSessionByRefreshToken(refreshToken);

    if (!logout) {
      throw new UnauthorizedException();
    }
    return;
  }

  @Post('refresh-token')
  @HttpCode(200)
  async getRefreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies.refreshToken;
    const deviceId = request.cookies.deviceId;
    const updateTokens = await this.jwtService.updateAccessTokenByRefreshToken(
      refreshToken,
      deviceId,
    );

    if (!updateTokens) {
      throw new UnauthorizedException();
    }
    const newAccessToken = updateTokens.accessToken;
    const newRefreshToken = updateTokens.refreshToken;
    response.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
    });

    return { accessToken: newAccessToken };
  }
}
