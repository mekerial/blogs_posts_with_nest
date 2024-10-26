import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostLike, PostLikeDocument } from './schemas/postLikeSchema';
import { Model } from 'mongoose';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class PostLikeRepository {
  constructor(
    @InjectModel(PostLike.name) private postLikeModel: Model<PostLikeDocument>,
    protected usersRepository: UsersRepository,
  ) {}

  async findLikeStatus(userId: string, postId: string) {
    const likeStatus = await this.postLikeModel
      .findOne({ userId: userId, postId: postId })
      .lean()
      .exec();

    return likeStatus;
  }

  async findNewestLikes(postId: string) {
    const likes = await this.postLikeModel
      .find({ postId: postId, status: 'Like' })
      .exec();

    const newestLikes = likes.slice(-3).reverse();
    const newestLikesViewModel = [];
    for (let i = 0; i < newestLikes.length; i++) {
      const userId = newestLikes[i].userId;
      const user = await this.usersRepository.getUser(userId);
      newestLikesViewModel[i] = {
        addedAt: newestLikes[i].addedAt,
        login: user.accountData.login,
        userId: userId,
      };
    }
    return newestLikesViewModel;
  }

  async createPostLike(postId: string, status: string, userId: string) {
    const addedAt = new Date().toISOString();
    return await this.postLikeModel.create({
      postId,
      userId,
      status,
      addedAt,
    });
  }

  async updateLikeStatus(postId: string, status: string, userId: string) {
    const updateLikeStatus = await this.postLikeModel
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
    const deleteLike = await this.postLikeModel
      .deleteOne({
        userId: userId,
        postId: postId,
      })
      .exec();
    return !!deleteLike.deletedCount;
  }
}
