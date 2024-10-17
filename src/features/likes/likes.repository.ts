import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeDocument } from './schemas/like.schema';
import { Model } from 'mongoose';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class LikesPostRepository {
  constructor(
    @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
    protected userRepository: UsersRepository,
  ) {}

  async findLikeStatus(userId: string, postId: string) {
    const likeStatus = await this.likeModel
      .findOne({ userId: userId, postId: postId })
      .lean()
      .exec();

    return likeStatus;
  }

  async findNewestLikes(postId: string) {
    const likes = await this.likeModel
      .find({ postId: postId, status: 'Like' })
      .exec();

    const newestLikes = likes.slice(-3).reverse();
    const newestLikesViewModel = [];
    for (let i = 0; i < newestLikes.length; i++) {
      const userId = newestLikes[i].userId;
      const user = await this.userRepository.getUser(userId);
      newestLikesViewModel[i] = {
        addedAt: newestLikes[i].addedAt,
        login: user.accountData.login,
        userId: userId,
      };
    }
    return newestLikesViewModel;
  }

  async createLikePost(postId: string, status: string, userId: string) {
    const addedAt = new Date().toISOString();
    return await this.likeModel.create({
      postId,
      userId,
      status,
      addedAt,
    });
  }

  async updateLikeStatus(postId: string, status: string, userId: string) {
    const updateLikeStatus = await this.likeModel
      .findOneAndUpdate(
        { postId: postId, userId: userId },
        {
          $set: {
            status: status,
          },
        },
      )
      .exec();
    return updateLikeStatus;
  }

  async deleteLike(userId: string, postId: string) {
    const deleteLike = await this.likeModel
      .deleteOne({
        userId: userId,
        postId: postId,
      })
      .exec();
    return !!deleteLike.deletedCount;
  }
}
