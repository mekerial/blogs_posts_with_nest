import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import mongoose, { Model, SortOrder } from 'mongoose';
import { QueryCommentInputModel } from '../../common/types';
import { CommentDbModel } from './types/comment.types';
import { ObjectId } from 'mongodb';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}
  async getAllCommentsByPost(postId: string, sortData: QueryCommentInputModel) {
    const pageNumber = sortData.pageNumber ?? 1;
    const pageSize = +(sortData.pageSize ?? 10);
    const sortBy = sortData.sortBy ?? 'createdAt';
    const sortDirection = sortData.sortDirection ?? 'desc';
    const sortOptions: Record<string, SortOrder> = {
      [sortBy]: sortDirection === 'desc' ? (-1 as SortOrder) : (1 as SortOrder),
    };

    const comments = await this.commentModel
      .find({ postId: postId })
      .sort(sortOptions)
      .skip((+pageNumber - 1) * pageSize)
      .limit(+pageSize)
      .lean()
      .exec();

    const allComments = await this.commentModel.find({ postId: postId }).exec();
    const totalCount = allComments.length;

    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page: +pageNumber,
      pageSize: pageSize,
      totalCount,
      items: comments,
    };
  }
  async getComment(commentId: string) {
    if (mongoose.Types.ObjectId.isValid(commentId)) {
      const findComment = await this.commentModel
        .findById(commentId)
        .lean()
        .exec();
      return findComment;
    }
    return;
  }

  async createComment(comment: CommentDbModel) {
    const createComment = await this.commentModel.create(comment);
    if (!createComment) {
      return false;
    }
    return createComment;
  }

  async editComment(commentId: string, content: string) {
    const updateComment = await this.commentModel
      .updateOne(
        { _id: new ObjectId(commentId) },
        {
          $set: {
            content: content,
          },
        },
      )
      .exec();
    return updateComment.modifiedCount;
  }

  async deleteComment(commentId: string) {
    const deleteComment = await this.commentModel
      .deleteOne({ _id: new ObjectId(commentId) })
      .exec();
    return deleteComment.deletedCount;
  }
}
