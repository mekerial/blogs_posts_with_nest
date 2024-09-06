import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, SortOrder } from 'mongoose';
import { QueryUserInputModel } from '../../common/types';
import { UserDbModel } from './types/user.types';
import { transformUserToViewModel } from './types/mappers';
import { UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}
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
    const user = await this.userModel.findById(userId);
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
}
