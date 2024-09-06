import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
@Injectable()
export class PasswordService {
  async generateSalt(value: number) {
    return await bcrypt.genSalt(value);
  }

  async generateHash(password: string, passwordSalt: string) {
    return await bcrypt.hash(password, passwordSalt);
  }
}
