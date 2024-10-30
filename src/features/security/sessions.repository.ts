import mongoose, { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Session, SessionDocument } from './schemas/session.schema';

@Injectable()
export class SessionsRepository {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) {}

  async getSessionByDeviceId(deviceId: string) {
    const deviceID = deviceId;

    const leanElement = await this.sessionModel
      .find({ deviceId: deviceID })
      .lean();

    if (!leanElement[0]) {
      return null;
    }
    return leanElement[0];
  }
  async createSession(
    ip: string,
    deviceId: string,
    deviceTitle: string,
    userId: string,
    refreshToken: string,
  ) {
    const issuedAt = new Date().toISOString();
    const deviceName = deviceTitle;
    const lastActiveDate = issuedAt;
    await this.sessionModel.insertMany([
      {
        issuedAt,
        lastActiveDate,
        deviceId,
        ip,
        deviceName,
        userId,
        refreshToken,
      },
    ]);
    return;
  }
  async getSessionByRefreshToken(refreshToken: string) {
    const result = await this.sessionModel
      .find({ refreshToken: refreshToken })
      .lean();
    if (!result[0]) {
      return null;
    }

    return result[0];
  }
  async updateSession(
    ip: string,
    issuedAt: string,
    deviceId: string,
    deviceTitle: string,
    userId: string,
    refreshToken: string,
    newRefreshToken: string,
  ) {
    console.log('updating session');
    const lastActiveDate = new Date().toISOString();
    const deviceName = deviceTitle;
    const sessionId = await this.sessionModel
      .find({ refreshToken: refreshToken })
      .lean();

    if (!sessionId[0]) {
      console.log('not found session');
      return;
    }

    console.log('updating session5');
    const result = await this.sessionModel.updateOne(
      { refreshToken: refreshToken },
      {
        $set: {
          issuedAt,
          lastActiveDate,
          deviceId,
          ip,
          deviceName,
          userId,
          refreshToken: newRefreshToken,
        },
      },
    );
    console.log('success update session');
    return;
  }

  async getSessionsByUserId(id: string) {
    const userId = new mongoose.Types.ObjectId(id);
    const sessions = await this.sessionModel.find({ userId: userId }).lean();
    return sessions;
  }

  async deleteSessions(userId: string, refreshToken: string) {
    await this.sessionModel.deleteMany({
      userId: userId,
      refreshToken: { $ne: refreshToken },
    });
  }

  async deleteSession(userId: string, deviceId: string) {
    const isDel = await this.sessionModel.deleteOne({
      userId: userId,
      deviceId: deviceId,
    });
    return isDel.deletedCount!!;
  }

  async deleteSessionByRefreshToken(refreshToken: string) {
    const session = await this.getSessionByRefreshToken(refreshToken);
    console.log('OMG');

    const result = await this.sessionModel.deleteOne({
      refreshToken: refreshToken,
    });

    return result.deletedCount!!;
  }
}
