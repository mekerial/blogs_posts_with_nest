import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { QueryUserInputModel } from '../../common/types';
import { PasswordService } from '../../applications/password.service';
import {
  CreateUserInputModelType,
  InputEmailModel,
  InputPasswordAndCode,
} from './types/user.types';
import { LoginInputModel } from '../auth/types/auth.types';
import { v4 as uuidv4 } from 'uuid';
import { emailAdapter } from '../../applications/email/email.adapter';
import { add } from 'date-fns/add';
@Injectable()
export class UsersService {
  constructor(
    protected usersRepository: UsersRepository,
    protected passwordService: PasswordService,
  ) {}
  async findUsers(sortData: QueryUserInputModel) {
    return await this.usersRepository.findUsers(sortData);
  }
  async getUser(userId: string) {
    return await this.usersRepository.getUser(userId);
  }

  async createUser(userData: CreateUserInputModelType) {
    const passwordSalt = await this.passwordService.generateSalt(10);
    const passwordHash = await this.passwordService.generateHash(
      userData.password,
      passwordSalt,
    );
    const createUser = {
      accountData: {
        login: userData.login,
        email: userData.email,
        passwordHash: passwordHash,
        passwordSalt: passwordSalt,
        createdAt: new Date().toISOString(),
      },
      emailConfirmation: {
        confirmationCode: '',
        expirationDate: new Date().toISOString(),
        isConfirmed: true,
      },
    };
    const user = await this.usersRepository.createUser(createUser);
    return user;
  }

  async registrateUser(userData: CreateUserInputModelType) {
    const confirmationCode = uuidv4();
    const codeExpirationDate = add(new Date(), {
      minutes: 15,
    }).toISOString();

    const passwordSalt = await this.passwordService.generateSalt(10);
    const passwordHash = await this.passwordService.generateHash(
      userData.password,
      passwordSalt,
    );
    const createUser = {
      accountData: {
        login: userData.login,
        email: userData.email,
        passwordHash: passwordHash,
        passwordSalt: passwordSalt,
        createdAt: new Date().toISOString(),
      },
      emailConfirmation: {
        confirmationCode: confirmationCode,
        expirationDate: codeExpirationDate,
        isConfirmed: false,
      },
    };

    const user = await this.usersRepository.createUser(createUser);

    if (!user) {
      return false;
    }
    emailAdapter.sendConfirmToEmail(userData.email, confirmationCode);

    return true;
  }

  async deleteUser(userId: string) {
    return await this.usersRepository.deleteUser(userId);
  }

  async checkCredentials(auth: LoginInputModel) {
    const loginOrEmail = auth.loginOrEmail;
    const user =
      await this.usersRepository.findUserByLoginOrEmail(loginOrEmail);
    if (!user) return false;

    const passwordHash = await this.passwordService.generateHash(
      auth.password,
      user.accountData.passwordSalt,
    );
    if (passwordHash === user.accountData.passwordHash) {
      return user;
    }
    return false;
  }

  async resendEmailConfirm(inputModel: InputEmailModel) {
    const email = inputModel.email;
    const user = await this.usersRepository.findUserByLoginOrEmail(email);
    if (!user || user.emailConfirmation.isConfirmed) {
      return false;
    }
    const code = uuidv4();
    const date = add(new Date(), {
      minutes: 15,
    });

    await this.usersRepository.recoveryConfirmationCode(
      user._id.toString(),
      code,
      date,
    );

    emailAdapter.sendConfirmToEmail(email, code);
    return true;
  }

  async confirmEmail(code: string) {
    const user = await this.usersRepository.findUserByConfirmationCode(code);
    if (!user) {
      return {
        flag: false,
        key: 'code',
      };
    }
    if (user.emailConfirmation.isConfirmed) {
      return {
        flag: false,
        key: 'code',
      };
    }

    if (
      code === user.emailConfirmation.confirmationCode &&
      user.emailConfirmation.expirationDate > new Date()
    ) {
      const result = await this.usersRepository.updateConfirmation(
        user._id.toString(),
      );

      if (!result) {
        return {
          flag: false,
          key: 'code',
        };
      }
      return {
        flag: true,
        key: 'none',
      };
    }
  }

  async passwordRecovery(inputEmail: InputEmailModel) {
    const user = await this.usersRepository.findUserByLoginOrEmail(
      inputEmail.email,
    );

    if (!user) {
      return false;
    }

    const code = uuidv4();
    const date = add(new Date(), {
      // hours: 1
      minutes: 30,
    });
    await this.usersRepository.recoveryPasswordVerifyCode(
      user._id.toString(),
      code,
      date,
    );

    emailAdapter.sendRecoveryPasswordToEmail(inputEmail.email, code);
    return true;
  }

  async setNewPassword(inputData: InputPasswordAndCode) {
    const newPassword = inputData.newPassword;
    const recoveryCode = inputData.recoveryCode;

    const userRcvryCode =
      await this.usersRepository.getRecoveryPasswordByVerifyCode(recoveryCode);
    if (!userRcvryCode) {
      return false;
    }

    if (
      recoveryCode === userRcvryCode!.recoveryCode &&
      userRcvryCode!.expirationDate! > new Date()
    ) {
      const result = await this.usersRepository.updatePassword(
        userRcvryCode!.userId!,
        newPassword,
      );

      if (!result) {
        return false;
      }

      return true;
    } else {
      return false;
    }
  }
}
