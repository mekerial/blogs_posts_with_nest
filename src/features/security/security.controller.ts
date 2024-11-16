import {
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Req,
  Res,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../../infrastructure/exception-filters/http-exception-filter';
import { Request, Response } from 'express';
import { JwtService } from '../../applications/jwt/jwt.service';
import { SessionsRepository } from './sessions.repository';
import { SecurityService } from './security.service';
import { SkipThrottle } from '@nestjs/throttler';

@UseFilters(HttpExceptionFilter)
@Controller('security')
export class SecurityController {
  constructor(
    protected jwtService: JwtService,
    protected sessionRepository: SessionsRepository,
    protected securityService: SecurityService,
  ) {}
  @SkipThrottle()
  @Get('devices')
  async getActiveSessions(@Req() request: Request) {
    console.log('GET security/devices');

    const refreshToken = request.cookies.refreshToken;

    const userId = await this.jwtService.getUserIdByRefreshToken(refreshToken);
    if (!userId) {
      throw new UnauthorizedException();
    }

    const activeSessionViewModel =
      await this.securityService.getActiveSessionsViewModel(refreshToken);

    if (!activeSessionViewModel) {
      throw new UnauthorizedException();
    }

    return activeSessionViewModel;
  }

  @SkipThrottle()
  @HttpCode(204)
  @Delete('devices')
  async deleteSessions(@Req() request: Request) {
    console.log('DELETE security/devices');

    const refreshToken = request.cookies.refreshToken;
    const userId = await this.jwtService.getUserIdByRefreshToken(refreshToken);

    if (!userId) {
      throw new UnauthorizedException();
    }
    await this.sessionRepository.deleteSessions(userId, refreshToken);
    return;
  }

  @SkipThrottle()
  @HttpCode(204)
  @Delete('devices/:id')
  async deleteOneSession(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Param('id') deviceId: string,
  ) {
    console.log('DELETE security/devices/:id');

    const deviceInDB =
      await this.sessionRepository.getSessionByDeviceId(deviceId);

    if (!deviceInDB) {
      throw new NotFoundException();
    }

    const refreshToken = request.cookies.refreshToken;
    const userId = await this.jwtService.getUserIdByRefreshToken(refreshToken);

    if (!userId) {
      throw new UnauthorizedException();
    }

    if (userId !== deviceInDB.userId) {
      response.sendStatus(403);
      return;
    }
    const sessionIsDel = await this.sessionRepository.deleteSession(
      userId,
      deviceId,
    );
    if (!sessionIsDel) {
      throw new NotFoundException();
    }
    return;
  }
}
