import { Injectable } from '@nestjs/common';
import { QueryBlogInputModel, QueryPostInputModel } from '../../common/types';
import { CreateBlogModel } from './types/blog.types';
import { BlogsRepository } from './blogs.repository';
import { transformBlogToViewModel } from './types/mappers';
import { PostsRepository } from '../posts/posts.repository';
import { CreatePostModelByBlog } from '../posts/types/post.types';
import { transformPostToViewModel } from '../posts/types/mappers';

@Injectable()
export class BlogsService {
  constructor(
    protected blogsRepository: BlogsRepository,
    protected postRepository: PostsRepository,
  ) {}
  async getAllBlogs(sortData: QueryBlogInputModel) {
    return await this.blogsRepository.getAllBlogs(sortData);
  }

  async getBlog(blogId) {
    const blog = await this.blogsRepository.getBlog(blogId);
    if (!blog) {
      return;
    }
    const blogViewModel = await transformBlogToViewModel([blog]);
    return blogViewModel[0];
  }

  async createBlog(blogData: CreateBlogModel) {
    const name = blogData.name;
    const description = blogData.description;
    const websiteUrl = blogData.websiteUrl;

    const newBlog: CreateBlogModel = {
      name,
      description,
      websiteUrl,
    };

    const createBlog = await this.blogsRepository.createBlog(newBlog);
    const createViewBlog = await transformBlogToViewModel([createBlog]);
    return createViewBlog[0];
  }

  async deleteBlog(blogId: string) {
    const deleteBlog = await this.blogsRepository.deleteBlog(blogId);
    if (!deleteBlog) {
      return false;
    }
    return true;
  }

  async updateBlog(blogId: string, InputModel: CreateBlogModel) {
    const findBlog = await this.blogsRepository.getBlog(blogId);
    if (!findBlog) {
      return;
    }
    const updateBlog = await this.blogsRepository.updateBlog(
      blogId,
      InputModel,
    );
    if (!updateBlog) {
      return;
    }
    return updateBlog;
  }

  async getAllPostsByBlog(blogId: string, sortData: QueryPostInputModel) {
    const findBlog = await this.blogsRepository.getBlog(blogId);
    if (!findBlog) {
      return;
    }
    return await this.postRepository.getAllPostsByBlogId(blogId, sortData);
  }

  async createPostByBlog(blogId: string, postData: CreatePostModelByBlog) {
    const blog = await this.blogsRepository.getBlog(blogId);
    if (!blog) {
      return;
    }
    const newPost = {
      ...postData,
      blogId: blogId,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };
    const createPost = await this.postRepository.createPost(newPost);
    const createPostViewModel = await transformPostToViewModel([createPost]);
    return createPostViewModel[0];
  }
}
