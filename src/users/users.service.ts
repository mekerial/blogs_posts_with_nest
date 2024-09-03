import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { QueryUserInputModel } from '../common/types';
import { PasswordService } from '../applications/password.service';
import { CreateUserInputModelType } from './types/user.types';

@Injectable()
export class UsersService {
  constructor(protected usersRepository: UsersRepository) {}
  async findUsers(sortData: QueryUserInputModel) {
    return await this.usersRepository.findUsers(sortData);
  }
  async getUser(userId: string) {
    return await this.usersRepository.getUser(userId);
  }

  async createUser(userData: CreateUserInputModelType) {
    const passwordSalt = await PasswordService.generateSalt(10);
    const passwordHash = await PasswordService.generateHash(
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

  async deleteUser(userId: string) {
    return await this.usersRepository.deleteUser(userId);
  }
}
