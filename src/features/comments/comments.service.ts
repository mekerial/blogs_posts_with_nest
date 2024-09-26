import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryCommentInputModel } from '../../common/types';
import { CommentsRepository } from './comments.repository';
import { PostsRepository } from '../posts/posts.repository';
import { CommentCreateModel } from './types/comment.types';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class CommentsService {
  constructor(
    protected commentsRepository: CommentsRepository,
    protected postsRepository: PostsRepository,
    protected usersRepository: UsersRepository,
  ) {}
  async getAllComments(
    postId: string,
    sortData: QueryCommentInputModel,
    accessToken: string = null,
  ) {
    const post = await this.postsRepository.getPost(postId);

    if (!post) {
      return false;
    }
    const commentsWithPagination =
      await this.commentsRepository.getAllCommentsByPost(postId, sortData);
    if (!accessToken) {
      return commentsWithPagination;
    } else {
      return commentsWithPagination;
      // check user and add my_status map
    }
  }
  async getComment(commentId: string) {
    const findComment = await this.commentsRepository.getComment(commentId);
    if (!findComment) {
      return false;
    }
    return findComment;
  }

  async createComment(
    postId: string,
    inputData: CommentCreateModel,
    userId: string,
  ) {
    const user = await this.usersRepository.getUser(userId);
    if (!user) {
      return false;
    }

    const findPost = await this.postsRepository.getPost(postId);
    if (!findPost) {
      return false;
    }
    const comment = {
      content: inputData.content,
      commentatorInfo: {
        userId: user._id.toString(),
        userLogin: user.accountData.login,
      },
      createdAt: new Date().toISOString(),
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
      },
      postId: findPost._id.toString(),
    };

    const createComment = await this.commentsRepository.createComment(comment);

    return createComment;
  }

  async editComment(userId: string, commentId: string, content: string) {
    const comment = await this.commentsRepository.getComment(commentId);
    if (userId !== comment.commentatorInfo.userId) {
      return {
        flag: false,
        status: 403,
      };
    }
    return await this.commentsRepository.editComment(commentId, content);
  }

  async deleteComment(commentId: string) {
    const deleteComment =
      await this.commentsRepository.deleteComment(commentId);
    if (!deleteComment) {
      throw new NotFoundException();
    }
    return true;
  }
}
