import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginInputModel } from './types/auth.types';
import { JwtService } from '../../applications/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    protected userService: UsersService,
    protected jwtService: JwtService,
  ) {}
  async loginUser(loginInputData: LoginInputModel) {
    const auth = await this.userService.checkCredentials(loginInputData);
    if (!auth) {
      return false;
    }
    const accessToken = this.jwtService.createJWT(auth._id.toString());
    return accessToken;
  }
}
