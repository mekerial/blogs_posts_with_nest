import { HydratedDocument } from 'mongoose';
import { Post } from '../schemas/post.schema';
import { LikesPostRepository } from '../../likes/likes.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostMappers {
  constructor(protected likePostRepository: LikesPostRepository) {}
  async transformPostToViewModel(posts: any[]) {
    //const postsViewModel: PostViewModel[] = [];
    const postsViewModel = [];
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i] as HydratedDocument<Post>;
      postsViewModel.push({
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
          likesCount: post.extendedLikesInfo.likesCount,
          dislikesCount: post.extendedLikesInfo.dislikesCount,
          myStatus: 'None',
          newestLikes: post.extendedLikesInfo.newestLikes,
        },
      });
    }
    return postsViewModel;
  }

  async transformPostsWithLikeStatus(posts: any[], userId: string) {
    if (userId) {
      const postViewModelWithStatus = [];
      for (let i = 0; i < posts.length; i++) {
        const myStatus = await this.likePostRepository.findLikeStatus(
          userId,
          posts[i]._id,
        );
        const newestLikes = await this.likePostRepository.findNewestLikes(
          posts[i]._id,
        );
        if (myStatus) {
          postViewModelWithStatus.push({
            id: posts[i]._id.toString(),
            title: posts[i].title,
            shortDescription: posts[i].shortDescription,
            content: posts[i].content,
            blogId: posts[i].blogId,
            blogName: posts[i].blogName,
            createdAt: posts[i].createdAt,
            extendedLikesInfo: {
              likesCount: posts[i].extendedLikesInfo.likesCount,
              dislikesCount: posts[i].extendedLikesInfo.dislikesCount,
              myStatus: myStatus.status,
              newestLikes: newestLikes,
            },
          });
        } else {
          postViewModelWithStatus.push({
            id: posts[i]._id.toString(),
            title: posts[i].title,
            shortDescription: posts[i].shortDescription,
            content: posts[i].content,
            blogId: posts[i].blogId,
            blogName: posts[i].blogName,
            createdAt: posts[i].createdAt,
            extendedLikesInfo: {
              likesCount: posts[i].extendedLikesInfo.likesCount,
              dislikesCount: posts[i].extendedLikesInfo.dislikesCount,
              myStatus: 'None',
              newestLikes: newestLikes,
            },
          });
        }
      }
      return postViewModelWithStatus;
    } else {
      const postViewModelWithoutStatus = [];
      for (let i = 0; i < posts.length; i++) {
        const newestLikes = await this.likePostRepository.findNewestLikes(
          posts[i]._id,
        );
        postViewModelWithoutStatus.push({
          id: posts[i]._id.toString(),
          title: posts[i].title,
          shortDescription: posts[i].shortDescription,
          content: posts[i].content,
          blogId: posts[i].blogId,
          blogName: posts[i].blogName,
          createdAt: posts[i].createdAt,
          extendedLikesInfo: {
            likesCount: posts[i].extendedLikesInfo.likesCount,
            dislikesCount: posts[i].extendedLikesInfo.dislikesCount,
            myStatus: 'None',
            newestLikes: newestLikes,
          },
        });
      }
      return postViewModelWithoutStatus;
    }
  }
}
