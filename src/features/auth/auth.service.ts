import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginInputModel } from './types/auth.types';
import { JwtService } from '../../applications/jwt/jwt.service';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateUserInputModelType,
  InputEmailModel,
  InputPasswordAndCode,
} from '../users/types/user.types';

@Injectable()
export class AuthService {
  constructor(
    protected usersService: UsersService,
    protected jwtService: JwtService,
  ) {}
  async loginUser(
    loginInputData: LoginInputModel,
    deviceTitle: string,
    ip: string,
  ) {
    const auth = await this.usersService.checkCredentials(loginInputData);
    if (!auth) {
      return false;
    }
    const accessToken = this.jwtService.createAccessJWT(auth._id.toString());
    const deviceId = uuidv4();
    const refreshToken = this.jwtService.createRefreshJWT(
      auth._id.toString(),
      deviceId,
    );
    return {
      refreshToken: refreshToken,
      deviceId: deviceId,
      accessToken: accessToken,
    };
  }

  async registrateUser(inputModel: CreateUserInputModelType) {
    return await this.usersService.registrateUser(inputModel);
  }

  async resendEmailConfirm(inputModel: InputEmailModel) {
    return await this.usersService.resendEmailConfirm(inputModel);
  }

  async confirmEmail(confirmationCode: string) {
    return await this.usersService.confirmEmail(confirmationCode);
  }

  async passwordRecovery(inputEmail: InputEmailModel) {
    return await this.usersService.passwordRecovery(inputEmail);
  }

  async setNewPassword(inputData: InputPasswordAndCode) {
    return await this.usersService.setNewPassword(inputData);
  }
}
