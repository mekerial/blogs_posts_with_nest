import * as bcrypt from 'bcrypt';
export class PasswordService {
  static async generateHash(password: string, passwordSalt: string) {
    return await bcrypt.hash(password, passwordSalt);
  }
  static async generateSalt(value: number) {
    return await bcrypt.genSalt(value);
  }
}
