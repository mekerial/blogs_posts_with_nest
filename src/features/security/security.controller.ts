import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Req,
  Res,
  UnauthorizedException,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../../infrastructure/exception-filters/http-exception-filter';
import { AuthGuard } from '../../infrastructure/guards/auth.guard';
import { Request, Response } from 'express';
import { JwtService } from '../../applications/jwt/jwt.service';
import { SessionsRepository } from './sessions.repository';

@UseFilters(HttpExceptionFilter)
@UseGuards(AuthGuard)
@Controller('security')
export class SecurityController {
  constructor(
    protected jwtService: JwtService,
    protected sessionRepository: SessionsRepository,
  ) {}
  @Get('devices')
  async getActiveSessions(@Req() request: Request) {
    const refreshToken = request.cookies.refreshToken;
    const userId = await this.jwtService.getUserIdByRefreshToken(refreshToken);

    if (!userId) {
      throw new UnauthorizedException();
    }

    const activeSessions =
      await this.sessionRepository.getSessionsByUserId(userId);
    return activeSessions;
  }

  @Delete('devices')
  async deleteSessions(@Req() request: Request) {
    const refreshToken = request.cookies.refreshToken;
    const userId = await this.jwtService.getUserIdByRefreshToken(refreshToken);

    if (!userId) {
      throw new UnauthorizedException();
    }
    await this.sessionRepository.deleteSessions(userId, refreshToken);
    return;
  }
  @Delete('devices/:id')
  async deleteOneSession(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Param('id') deviceId: string,
  ) {
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
