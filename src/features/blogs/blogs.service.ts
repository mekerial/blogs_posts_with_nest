import { Injectable } from '@nestjs/common';
import { QueryBlogInputModel, QueryPostInputModel } from '../../common/types';
import { CreateBlogModel } from './types/blog.types';
import { BlogsRepository } from './blogs.repository';
import { transformBlogToViewModel } from './types/mappers';
import { PostsRepository } from '../posts/posts.repository';
import { CreatePostModelByBlog } from '../posts/types/post.types';
import { PostMappers } from '../posts/types/mappers';
import { JwtService } from '../../applications/jwt.service';

@Injectable()
export class BlogsService {
  constructor(
    protected blogsRepository: BlogsRepository,
    protected postRepository: PostsRepository,
    protected jwtService: JwtService,
    protected postMappers: PostMappers,
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

  async getAllPostsByBlog(
    blogId: string,
    sortData: QueryPostInputModel,
    accessToken: string,
  ) {
    const findBlog = await this.blogsRepository.getBlog(blogId);
    if (!findBlog) {
      return;
    }
    let userId;
    if (accessToken) {
      userId = this.jwtService.getUserIdByAccessToken(accessToken).toString();
    }

    const postsWithoutMapper = await this.postRepository.getAllPostsByBlogId(
      blogId,
      sortData,
    );
    const postsWithMyStatus =
      await this.postMappers.transformPostsWithLikeStatus(
        postsWithoutMapper.items,
        userId,
      );
    const postsWithPaginationAndMapper = {
      ...postsWithoutMapper,
      items: postsWithMyStatus,
    };
    return postsWithPaginationAndMapper;
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
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        newestLikes: [],
      },
    };
    const createPost = await this.postRepository.createPost(newPost);
    const createPostViewModel = await this.postMappers.transformPostToViewModel(
      [createPost],
    );
    return createPostViewModel[0];
  }
}
