import { Injectable } from '@nestjs/common';
import { SessionsRepository } from './sessions.repository';
import { JwtService } from '../../applications/jwt/jwt.service';

@Injectable()
export class SecurityService {
  constructor(
    protected sessionRepository: SessionsRepository,
    protected jwtService: JwtService,
  ) {}
  async createSession(
    ip: string,
    deviceTitle: string,
    deviceId: string,
    userId: string,
    refreshToken: string,
  ) {
    await this.sessionRepository.createSession(
      ip,
      deviceId,
      deviceTitle,
      userId,
      refreshToken,
    );
    return;
  }

  async deleteSessions(refreshToken: string) {
    const userId = await this.jwtService.getUserIdByRefreshToken(refreshToken);
    return await this.sessionRepository.deleteSessions(userId!, refreshToken);
  }

  async deleteSession(userId: string, deviceId: string) {
    return await this.sessionRepository.deleteSession(userId, deviceId);
  }

  async updateSession(
    refreshToken: string,
    deviceId: string,
    newRefreshToken: string,
  ) {
    console.log('security service get session: ');

    const session =
      await this.sessionRepository.getSessionByRefreshToken(refreshToken);
    console.log(session);
    return await this.sessionRepository.updateSession(
      session!.ip,
      session!.issuedAt,
      session!.deviceId,
      session!.deviceName,
      session!.userId,
      refreshToken,
      newRefreshToken,
    );
  }

  async deleteSessionByRefreshToken(refreshToken: string) {
    return await this.sessionRepository.deleteSessionByRefreshToken(
      refreshToken,
    );
  }
}
