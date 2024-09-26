import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginInputModel } from './types/auth.types';
import { JwtService } from '../../applications/jwt.service';
import {
  CreateUserInputModelType,
  InputEmailModel,
  InputPasswordAndCode,
} from '../users/types/user.types';
import { response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    protected usersService: UsersService,
    protected jwtService: JwtService,
  ) {}
  async loginUser(loginInputData: LoginInputModel) {
    const auth = await this.usersService.checkCredentials(loginInputData);
    if (!auth) {
      return false;
    }
    const accessToken = this.jwtService.createJWT(auth._id.toString());
    return accessToken;
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
