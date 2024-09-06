import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { QueryUserInputModel } from '../../common/types';
import { PasswordService } from '../../applications/password.service';
import { CreateUserInputModelType } from './types/user.types';
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
      minutes: 5,
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
    await emailAdapter.sendConfirmToEmail(userData.email, confirmationCode);

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
}
