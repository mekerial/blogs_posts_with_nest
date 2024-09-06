import jwt from 'jsonwebtoken';
import * as process from 'process';
import mongoose from 'mongoose';
import { Injectable } from '@nestjs/common';
@Injectable()
export class JwtService {
  async createJWT(userId: string) {
    const accessToken = jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
      expiresIn: '5m',
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
}
