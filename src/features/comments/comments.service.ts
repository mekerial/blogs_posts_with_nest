import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryCommentInputModel } from '../../common/types';
import { CommentsRepository } from './comments.repository';
import { PostsRepository } from '../posts/posts.repository';
import { CommentCreateModel } from './types/comment.types';
import { UsersRepository } from '../users/users.repository';
import { JwtService } from '../../applications/jwt/jwt.service';
import { CommentMappers } from './types/mappers';
import { CommentLikeRepository } from '../likes/commentLike.repository';

@Injectable()
export class CommentsService {
  constructor(
    protected commentsRepository: CommentsRepository,
    protected postsRepository: PostsRepository,
    protected usersRepository: UsersRepository,
    protected commentMappers: CommentMappers,
    protected jwtService: JwtService,
    protected commentLikeRepository: CommentLikeRepository,
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
    let userId;
    if (accessToken) {
      userId = this.jwtService.getUserIdByAccessToken(accessToken).toString();
    }

    const commentsWithPagination =
      await this.commentsRepository.getAllCommentsByPost(postId, sortData);
    commentsWithPagination.items =
      await this.commentMappers.transformCommentsWithLikeStatus(
        commentsWithPagination.items,
        userId,
      );
    return commentsWithPagination;
  }
  async getComment(commentId: string, accessToken: string) {
    const findComment = await this.commentsRepository.getComment(commentId);
    let userId;
    if (accessToken) {
      userId = this.jwtService.getUserIdByAccessToken(accessToken).toString();
    }

    if (!findComment) {
      return false;
    }

    const commentViewModel =
      await this.commentMappers.transformCommentsWithLikeStatus(
        [findComment],
        userId,
      );

    return commentViewModel[0];
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

    let newComment;
    if (createComment) {
      newComment = {
        id: createComment._id,
        content: comment.content,
        commentatorInfo: comment.commentatorInfo,
        createdAt: comment.createdAt,
        likesInfo: {
          likesCount: comment.likesInfo.likesCount,
          dislikesCount: comment.likesInfo.dislikesCount,
          myStatus: 'None',
        },
      };
    }

    return newComment;
  }

  async editComment(userId: string, commentId: string, content: string) {
    const comment = await this.commentsRepository.getComment(commentId);
    if (!comment) {
      return {
        flag: false,
        status: 404,
      };
    }
    if (userId !== comment.commentatorInfo.userId) {
      return {
        flag: false,
        status: 403,
      };
    }
    return {
      flag: true,
      data: await this.commentsRepository.editComment(commentId, content),
      status: 200,
    };
  }

  async deleteComment(userId: string, commentId: string) {
    const findComment = await this.commentsRepository.getComment(commentId);
    if (!findComment) {
      throw new NotFoundException();
    }
    if (userId !== findComment.commentatorInfo.userId) {
      return {
        flag: false,
        status: 403,
      };
    }

    const deleteComment =
      await this.commentsRepository.deleteComment(commentId);
    if (!deleteComment) {
      return {
        flag: false,
        status: 404,
      };
    }
    return {
      flag: true,
      data: deleteComment,
      status: 204,
    };
  }

  async createLikeStatusComment(
    commentId: string,
    likeStatus: string,
    userId: string,
  ) {
    const findComment = await this.commentsRepository.getComment(commentId);
    if (!findComment) {
      return false;
    }

    const findLike = await this.commentLikeRepository.findLikeStatus(
      userId,
      commentId,
    );
    if (findLike) {
      if (findLike.status === likeStatus) {
        return true;
      } else {
        if (findLike.status === 'Like') {
          findComment.likesInfo.likesCount--;
          await this.commentsRepository.updateCommentLikesInfo(
            commentId,
            findComment,
          );
          await this.commentLikeRepository.deleteLike(userId, commentId);
        }
        if (findLike.status === 'Dislike') {
          findComment.likesInfo.dislikesCount--;
          await this.commentsRepository.updateCommentLikesInfo(
            commentId,
            findComment,
          );
        }
      }
      findLike.status = likeStatus;
      await this.commentLikeRepository.updateLikeStatus(
        findLike.commentId,
        findLike.status,
        findLike.userId,
      );
    }
    //create like status
    await this.commentLikeRepository.createCommentLike(
      commentId,
      likeStatus,
      userId,
    );
    if (likeStatus === 'Like') {
      findComment.likesInfo.likesCount++;
      await this.commentsRepository.updateCommentLikesInfo(
        commentId,
        findComment,
      );
    }
    if (likeStatus === 'Dislike') {
      findComment.likesInfo.dislikesCount++;
      await this.commentsRepository.updateCommentLikesInfo(
        commentId,
        findComment,
      );
    }
    return true;
  }
}
