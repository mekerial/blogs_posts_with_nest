import { Injectable } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { QueryPostInputModel } from '../../common/types';
import { CreatePostModel, UpdatePostModel } from './types/post.types';
import { BlogsRepository } from '../blogs/blogs.repository';
import { transformPostToViewModel } from './types/mappers';

@Injectable()
export class PostsService {
  constructor(
    protected postsRepository: PostsRepository,
    protected blogsRepository: BlogsRepository,
  ) {}

  async getAllPosts(sortData: QueryPostInputModel) {
    return await this.postsRepository.getAllPosts(sortData);
  }

  async getPost(postId: string) {
    const post = await this.postsRepository.getPost(postId);
    if (!post) {
      return;
    }
    const postViewModel = await transformPostToViewModel([post]);
    return postViewModel[0];
  }

  async createPost(postData: CreatePostModel) {
    const findBlog = await this.blogsRepository.getBlog(postData.blogId);
    if (!findBlog) {
      return;
    }
    const post = {
      ...postData,
      blogName: findBlog.name,
      createdAt: new Date().toISOString(),
    };
    const createPost = await this.postsRepository.createPost(post);
    const createViewPost = await transformPostToViewModel([createPost]);
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
}
