import jwt from 'jsonwebtoken';
import * as process from 'process';
import mongoose, { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RefreshToken, RefreshTokenDocument } from './resfreshToken.schema';
import { SessionsRepository } from '../../features/security/sessions.repository';
@Injectable()
export class JwtService {
  constructor(
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
    private sessionsRepository: SessionsRepository,
  ) {}

  async createAccessJWT(userId: string) {
    const accessToken = jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
      expiresIn: '10s',
    });
    return accessToken;
  }
  getUserIdByAccessToken(accessToken: string) {
    try {
      const result: any = jwt.verify(accessToken, process.env.JWT_SECRET!);
      return new mongoose.Types.ObjectId(result.userId);
    } catch {
      return false;
    }
  }

  async createRefreshJWT(userId: string, deviceId: string) {
    const refreshTokenWithId = {
      userId: userId,
      refreshToken: jwt.sign(
        { userId: userId, deviceId: deviceId },
        process.env.REFRESH_SECRET,
        { expiresIn: '20s' },
      ),
    };
    await this.refreshTokenModel.insertMany([refreshTokenWithId]);
    return refreshTokenWithId.refreshToken;
  }

  async getUserIdByRefreshToken(refreshToken: string) {
    try {
      const result: any = jwt.verify(refreshToken, process.env.REFRESH_SECRET!);
      const getRefreshToken = await this.refreshTokenModel
        .find({ refreshToken: refreshToken })
        .lean();

      if (getRefreshToken[0]) {
        return result.userId;
      } else {
        return null;
      }
    } catch {
      return null;
    }
  }

  async getDeviceIdByRefreshToken(refreshToken: string) {
    try {
      const result: any = jwt.verify(refreshToken, process.env.REFRESH_SECRET!);
      const getRefreshToken = await this.refreshTokenModel
        .find({ refreshToken: refreshToken })
        .lean();

      if (getRefreshToken[0]) {
        return result.deviceId;
      } else {
        return null;
      }
    } catch {
      return null;
    }
  }

  async updateAccessTokenByRefreshToken(
    refreshToken: string,
    deviceId: string,
  ) {
    const result = await this.refreshTokenModel
      .find({ refreshToken: refreshToken })
      .lean();
    if (!result[0]) {
      return null;
    }
    const userId = (
      await this.getUserIdByRefreshToken(refreshToken)
    ).toString();

    if (!userId || !(result[0].userId !== userId)) {
      console.log('1 unsuccess update tokens!');
      return null;
    }

    if (result) {
      try {
        const verifyToken: any = jwt.verify(
          refreshToken,
          process.env.REFRESH_SECRET!,
        );
        const newAccessToken = await this.createAccessJWT(userId);
        const newRefreshToken = await this.createRefreshJWT(userId, deviceId);

        await this.refreshTokenModel.deleteOne({ refreshToken: refreshToken });

        const session =
          await this.sessionsRepository.getSessionByRefreshToken(refreshToken);
        console.log('updating session in jwt');
        await this.sessionsRepository.updateSession(
          session.ip,
          session.issuedAt,
          session.deviceId,
          session.deviceName,
          session.userId,
          refreshToken,
          newRefreshToken,
        );

        console.log('success update tokens!');

        return {
          userId: verifyToken.userId,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        };
      } catch {
        console.log('2 unsuccess update tokens!');
        return null;
      }
    } else {
      console.log('3 unsuccess update tokens!');
      return null;
    }
  }

  async revokeRefreshToken(refreshToken: string) {
    const result = await this.refreshTokenModel
      .find({ refreshToken: refreshToken })
      .lean();
    if (!result[0]) {
      return null;
    }

    const userId = await this.getUserIdByRefreshToken(refreshToken);
    if (!userId || !(result[0].userId !== userId)) {
      return null;
    }

    if (result) {
      try {
        const verifyToken: any = jwt.verify(
          refreshToken,
          process.env.REFRESH_SECRET!,
        );

        await this.refreshTokenModel.deleteOne({ refreshToken: refreshToken });

        console.log('success delete token! logout');

        return verifyToken;
      } catch {
        return null;
      }
    } else {
      return null;
    }
  }
}
