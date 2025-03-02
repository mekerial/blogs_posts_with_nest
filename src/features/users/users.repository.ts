import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, SortOrder } from 'mongoose';
import { QueryUserInputModel } from '../../common/queryInputTypes';
import { UserDbModel } from './types/user.types';
import { transformUserToViewModel } from './types/mappers';
import { UserDocument } from './schemas/user.schema';
import { PasswordRecoveryDocument } from './schemas/passwords-recovery.schema';
import { PasswordService } from '../../applications/password.service';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    @InjectModel('PasswordRecovery')
    private passwordRecoveryModel: Model<PasswordRecoveryDocument>,
    protected passwordService: PasswordService,
  ) {}
  async findUsers(sortData: QueryUserInputModel) {
    const sortBy = sortData.sortBy ?? 'createdAt';
    const sortDirection = sortData.sortDirection ?? 'desc';
    const pageNumber = sortData.pageNumber ?? 1;
    const pageSize = sortData.pageSize ?? 10;
    const searchLoginTerm = sortData.searchLoginTerm ?? null;
    const searchEmailTerm = sortData.searchEmailTerm ?? null;

    let filter = {};
    const filterOptions: any = [];

    if (searchLoginTerm) {
      filterOptions.push({
        'accountData.login': {
          $regex: searchLoginTerm,
          $options: 'i',
        },
      });
    }
    if (searchEmailTerm) {
      filterOptions.push({
        'accountData.email': {
          $regex: searchEmailTerm,
          $options: 'i',
        },
      });
    }
    if (filterOptions.length > 1) {
      filter = {
        $or: filterOptions,
      };
    } else {
      filter = filterOptions[0];
    }
    const sortOptions: Record<string, SortOrder> = {
      ['accountData.' + sortBy]:
        sortDirection === 'desc' ? (-1 as SortOrder) : (1 as SortOrder),
    };
    const users = await this.userModel
      .find(filter)
      .sort(sortOptions)
      .skip((pageNumber - 1) * pageSize)
      .limit(+pageSize)
      .lean()
      .exec();
    const totalCount = await this.userModel.countDocuments(filter);

    const pagesCount = Math.ceil(totalCount / +pageSize);
    const usersViewModel = await transformUserToViewModel(users);

    return {
      pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount,
      items: usersViewModel,
    };
  }
  async getUser(userId: string) {
    const user = await this.userModel.findById(userId).exec();
    return user;
  }
  async createUser(userData: UserDbModel) {
    const user = {
      ...userData,
    };

    const createdUser = await this.userModel.create(user);
    return {
      id: createdUser._id,
      login: user.accountData.login,
      email: user.accountData.email,
      createdAt: user.accountData.createdAt,
    };
  }

  async deleteUser(userId: string) {
    const objectId = new mongoose.Types.ObjectId(userId);
    const deleteUser = await this.userModel.deleteOne({ _id: objectId }).exec();
    return !!deleteUser.deletedCount;
  }

  async findUserByLoginOrEmail(loginOrEmail: string) {
    const user = await this.userModel
      .find({
        $or: [
          { 'accountData.email': loginOrEmail },
          { 'accountData.login': loginOrEmail },
        ],
      })
      .lean();
    if (!user[0]) {
      return null;
    }
    return user[0];
  }

  async nameIsExist(value: string) {
    const user = await this.userModel
      .find({ 'accountData.login': value })
      .lean()
      .exec();

    if (user.length === 0) {
      return false;
    }

    return true;
  }
  async emailIsExist(value: string) {
    const user = await this.userModel
      .find({ 'accountData.email': value })
      .lean()
      .exec();

    if (user.length === 0) {
      return false;
    }

    return true;
  }

  async recoveryConfirmationCode(userId: string, code: string, date: Date) {
    await this.userModel.updateOne(
      { _id: userId },
      {
        $set: {
          'emailConfirmation.confirmationCode': code,
          'emailConfirmation.expirationDate': date,
        },
      },
    );
    return true;
  }

  async findUserByConfirmationCode(confirmationCode: string) {
    const user = await this.userModel
      .find({
        'emailConfirmation.confirmationCode': confirmationCode,
      })
      .lean();
    if (!user[0]) {
      return false;
    }
    return user[0];
  }

  async updateConfirmation(userId: string) {
    const result = await this.userModel
      .updateOne(
        { _id: userId },
        { $set: { 'emailConfirmation.isConfirmed': true } },
      )
      .exec();
    return result.modifiedCount === 1;
  }

  async recoveryPasswordVerifyCode(userId: string, code: string, date: Date) {
    const userRecoveryPassword = await this.passwordRecoveryModel
      .find({ userId: userId })
      .lean();
    if (!userRecoveryPassword) {
      await this.passwordRecoveryModel.insertMany([
        {
          userId: userId,
          confirmationCode: code,
          expirationDate: date,
        },
      ]);
      return true;
    }

    await this.passwordRecoveryModel.updateOne(
      { userId: userId },
      { $set: { recoveryCode: code, expirationDate: date } },
    );

    return true;
  }
  async getRecoveryPasswordByVerifyCode(code: string) {
    const recoveryPassword = await this.passwordRecoveryModel
      .find({ recoveryCode: code })
      .lean();

    if (!recoveryPassword[0]) {
      return null;
    }
    return {
      userId: recoveryPassword[0].userId,
      recoveryCode: recoveryPassword[0].recoveryCode,
      expirationDate: recoveryPassword[0].expirationDate,
    };
  }

  async updatePassword(userId: string, newPassword: string) {
    const recoveryPassword = await this.passwordRecoveryModel
      .find({ userId: userId })
      .lean();
    if (!recoveryPassword[0]) {
      return false;
    }

    const passwordSalt = await this.passwordService.generateSalt(10);
    const newPasswordHash = await this.passwordService.generateHash(
      newPassword,
      passwordSalt,
    );

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const result = await this.userModel
      .updateOne(
        { _id: userObjectId },
        {
          $set: {
            'accountData.passwordHash': newPasswordHash,
            'accountData.passwordSalt': passwordSalt,
          },
        },
      )
      .exec();

    await this.passwordRecoveryModel.deleteOne({ userId: userId });

    return result.modifiedCount === 1;
  }
}
