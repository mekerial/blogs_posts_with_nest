import { Injectable } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { QueryPostInputModel } from '../../common/types';
import { CreatePostModel, UpdatePostModel } from './types/post.types';
import { BlogsRepository } from '../blogs/blogs.repository';
import { PostMappers } from './types/mappers';
import { PostLikeRepository } from '../likes/postLike.repository';
import { JwtService } from '../../applications/jwt/jwt.service';

@Injectable()
export class PostsService {
  constructor(
    protected postsRepository: PostsRepository,
    protected blogsRepository: BlogsRepository,
    protected likesPostRepository: PostLikeRepository,
    protected postMappers: PostMappers,
    protected jwtService: JwtService,
  ) {}

  async getAllPosts(sortData: QueryPostInputModel, accessToken: string) {
    let userId;
    if (accessToken) {
      userId = this.jwtService.getUserIdByAccessToken(accessToken).toString();
    }

    const postsWithPagination =
      await this.postsRepository.getAllPosts(sortData);
    postsWithPagination.items =
      await this.postMappers.transformPostsWithLikeStatus(
        postsWithPagination.items,
        userId,
      );
    return postsWithPagination;
  }

  async getPost(postId: string, accessToken: string) {
    const post = await this.postsRepository.getPost(postId);
    if (!post) {
      return;
    }
    let userId;
    if (accessToken) {
      userId = this.jwtService.getUserIdByAccessToken(accessToken).toString();
    }

    const postViewModel = await this.postMappers.transformPostsWithLikeStatus(
      [post],
      userId,
    );
    return postViewModel[0];
  }

  async createPost(postData: CreatePostModel) {
    const findBlog = await this.blogsRepository.getBlog(postData.blogId);
    if (!findBlog) {
      return false;
    }
    const post = {
      ...postData,
      blogName: findBlog.name,
      createdAt: new Date().toISOString(),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        newestLikes: [],
      },
    };
    const createPost = await this.postsRepository.createPost(post);
    const createViewPost = await this.postMappers.transformPostToViewModel([
      createPost,
    ]);
    return createViewPost[0];
  }

  async updatePost(postId: string, updateData: UpdatePostModel) {
    const findPost = await this.postsRepository.getPost(postId);
    if (!findPost) {
      return;
    }
    const updatePost = await this.postsRepository.updatePost(
      postId,
      updateData,
    );
    return updatePost;
  }

  async deletePost(postId: string) {
    const findPost = await this.postsRepository.getPost(postId);
    if (!findPost) {
      return;
    }
    return await this.postsRepository.deletePost(postId);
  }

  async createLikeStatusPost(
    postId: string,
    likeStatus: string,
    userId: string,
  ) {
    const findPost = await this.postsRepository.getPost(postId);
    if (!findPost) {
      return false;
    }

    const findLike = await this.likesPostRepository.findLikeStatus(
      userId,
      postId,
    );
    if (findLike) {
      if (findLike.status === likeStatus) {
        return true;
      } else {
        if (findLike.status === 'Like') {
          findPost.extendedLikesInfo.likesCount--;
          await this.postsRepository.updatePostLikesInfo(postId, findPost);
          await this.likesPostRepository.deleteLike(userId, postId);
        }
        if (findLike.status === 'Dislike') {
          findPost.extendedLikesInfo.dislikesCount--;
          await this.postsRepository.updatePostLikesInfo(postId, findPost);
        }
      }
      findLike.status = likeStatus;
      await this.likesPostRepository.updateLikeStatus(
        findLike.postId,
        findLike.status,
        findLike.userId,
      );
    }
    //create like status
    await this.likesPostRepository.createPostLike(postId, likeStatus, userId);
    if (likeStatus === 'Like') {
      findPost.extendedLikesInfo.likesCount++;
      await this.postsRepository.updatePostLikesInfo(postId, findPost);
    }
    if (likeStatus === 'Dislike') {
      findPost.extendedLikesInfo.dislikesCount++;
      await this.postsRepository.updatePostLikesInfo(postId, findPost);
    }

    return true;
  }
}
