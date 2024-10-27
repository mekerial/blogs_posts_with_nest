import { Injectable } from '@nestjs/common';
import { CommentLikeRepository } from '../../likes/commentLike.repository';

@Injectable()
export class CommentMappers {
  constructor(protected commentLikeRepository: CommentLikeRepository) {}

  async transformCommentsWithLikeStatus(comments: any[], userId: string) {
    if (userId) {
      const commentsViewModelWithStatus = [];
      for (let i = 0; i < comments.length; i++) {
        const myStatus = await this.commentLikeRepository.findLikeStatus(
          userId,
          comments[i]._id,
        );
        if (myStatus) {
          commentsViewModelWithStatus.push({
            id: comments[i]._id.toString(),
            content: comments[i].content,
            createdAt: comments[i].createdAt,
            commentatorInfo: {
              userId: comments[i].commentatorInfo.userId,
              userLogin: comments[i].commentatorInfo.userLogin,
            },
            likesInfo: {
              likesCount: comments[i].likesInfo.likesCount,
              dislikesCount: comments[i].likesInfo.dislikesCount,
              myStatus: myStatus.status,
            },
          });
        } else {
          commentsViewModelWithStatus.push({
            id: comments[i]._id.toString(),
            content: comments[i].content,
            createdAt: comments[i].createdAt,
            commentatorInfo: {
              userId: comments[i].commentatorInfo.userId,
              userLogin: comments[i].commentatorInfo.userLogin,
            },
            likesInfo: {
              likesCount: comments[i].likesInfo.likesCount,
              dislikesCount: comments[i].likesInfo.dislikesCount,
              myStatus: 'None',
            },
          });
        }
      }
      return commentsViewModelWithStatus;
    } else {
      const commentsViewModelWithoutStatus = [];
      for (let i = 0; i < comments.length; i++) {
        commentsViewModelWithoutStatus.push({
          id: comments[i]._id.toString(),
          content: comments[i].content,
          createdAt: comments[i].createdAt,
          commentatorInfo: {
            userId: comments[i].commentatorInfo.userId,
            userLogin: comments[i].commentatorInfo.userLogin,
          },
          likesInfo: {
            likesCount: comments[i].likesInfo.likesCount,
            dislikesCount: comments[i].likesInfo.dislikesCount,
            myStatus: 'None',
          },
        });
      }
      return commentsViewModelWithoutStatus;
    }
  }
}
