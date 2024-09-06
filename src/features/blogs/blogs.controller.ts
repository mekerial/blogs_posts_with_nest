import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { QueryBlogInputModel } from '../../common/types';
import { CreateBlogModel } from './types/blog.types';
import { CreatePostModelByBlog } from '../posts/types/post.types';
import { HttpExceptionFilter } from '../../infrastructure/exception-filters/http-exception-filter';

@UseFilters(HttpExceptionFilter)
@Controller('blogs')
export class BlogsController {
  constructor(protected blogsService: BlogsService) {}
  @Get()
  async getAllBlogs(@Query() sortData: QueryBlogInputModel) {
    return this.blogsService.getAllBlogs(sortData);
  }

  @Get(':id')
  async getBlog(@Param('id') id: string) {
    const blog = await this.blogsService.getBlog(id);
    if (!blog) {
      throw new NotFoundException(`Blog with id ${id} not found`);
    }
    return blog;
  }

  @Post()
  async createBlog(@Body() inputModel: CreateBlogModel) {
    const createBlog = await this.blogsService.createBlog(inputModel);
    return createBlog;
  }

  @Put(':id')
  @HttpCode(204)
  async updateBlog(
    @Param('id') blogId: string,
    @Body() InputModel: CreateBlogModel,
  ) {
    const updateBlog = await this.blogsService.updateBlog(blogId, InputModel);
    if (!updateBlog) {
      throw new NotFoundException(`Blog with id ${blogId} not found`);
    }
    return updateBlog;
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteBlog(@Param('id') blogId: string) {
    const deleteBlog = await this.blogsService.deleteBlog(blogId);
    if (!deleteBlog) {
      throw new NotFoundException(`Blog with id ${blogId} not found`);
    }
    return;
  }

  @Get(':id/posts')
  async getAllPostsByBlog(
    @Param('id') blogId: string,
    @Query() sortData: QueryBlogInputModel,
  ) {
    const posts = await this.blogsService.getAllPostsByBlog(blogId, sortData);
    if (!posts) {
      throw new NotFoundException(`Blog with id ${blogId} not found`);
    }
    return posts;
  }

  @Post(':id/posts')
  async createPostByBlog(
    @Param('id') blogId: string,
    @Body() inputModel: CreatePostModelByBlog,
  ) {
    const createPost = await this.blogsService.createPostByBlog(
      blogId,
      inputModel,
    );
    if (!createPost) {
      throw new NotFoundException(`Blog with id ${blogId} not found`);
    }
    return createPost;
  }
}
