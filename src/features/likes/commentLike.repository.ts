import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommentLike, CommentLikeDocument } from './schemas/commentLikeSchema';
import { Model } from 'mongoose';
import { UsersRepository } from '../users/users.repository';

Injectable();
export class CommentLikeRepository {
  constructor(
    @InjectModel(CommentLike.name)
    private commentLikeModel: Model<CommentLikeDocument>,
    protected usersRepository: UsersRepository,
  ) {}

  async findLikeStatus(userId: string, commentId: string) {
    const likeStatus = await this.commentLikeModel
      .findOne({
        userId: userId,
        commentId: commentId,
      })
      .lean()
      .exec();

    return likeStatus;
  }

  async createCommentLike(commentId: string, status: string, userId: string) {
    const addedAt = new Date().toISOString();
    return await this.commentLikeModel.create({
      commentId,
      userId,
      status,
      addedAt,
    });
  }

  async updateLikeStatus(commentId: string, status: string, userId: string) {
    const updateLikeStatus = await this.commentLikeModel
      .findOneAndUpdate(
        { commentId: commentId, userId: userId },
        {
          $set: {
            status: status,
          },
        },
      )
      .exec();

    return updateLikeStatus;
  }

  async deleteLike(userId: string, commentId: string) {
    const deleteLike = await this.commentLikeModel
      .deleteOne({ userId: userId, commentId: commentId })
      .exec();
    return !!deleteLike.deletedCount;
  }
}
