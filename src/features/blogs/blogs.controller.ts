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
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { QueryBlogInputModel } from '../../common/types';
import { CreateBlogModel } from './types/blog.types';
import { CreatePostModelByBlog } from '../posts/types/post.types';
import { HttpExceptionFilter } from '../../infrastructure/exception-filters/http-exception-filter';
import { BasicAuthGuard } from '../../infrastructure/guards/basic-auth.guard';
import { Request } from 'express';
import { SkipThrottle } from '@nestjs/throttler';

@UseFilters(HttpExceptionFilter)
@Controller('blogs')
export class BlogsController {
  constructor(protected blogsService: BlogsService) {}
  @SkipThrottle()
  @Get()
  async getAllBlogs(@Query() sortData: QueryBlogInputModel) {
    return this.blogsService.getAllBlogs(sortData);
  }

  @SkipThrottle()
  @Get(':id')
  async getBlog(@Param('id') id: string) {
    const blog = await this.blogsService.getBlog(id);
    if (!blog) {
      throw new NotFoundException(`Blog with id ${id} not found`);
    }
    return blog;
  }
  @SkipThrottle()
  @UseGuards(BasicAuthGuard)
  @Post()
  async createBlog(@Body() inputModel: CreateBlogModel) {
    const createBlog = await this.blogsService.createBlog(inputModel);
    return createBlog;
  }

  @SkipThrottle()
  @UseGuards(BasicAuthGuard)
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
  @SkipThrottle()
  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteBlog(@Param('id') blogId: string) {
    const deleteBlog = await this.blogsService.deleteBlog(blogId);
    if (!deleteBlog) {
      throw new NotFoundException(`Blog with id ${blogId} not found`);
    }
    return;
  }

  @SkipThrottle()
  @Get(':id/posts')
  async getAllPostsByBlog(
    @Param('id') blogId: string,
    @Query() sortData: QueryBlogInputModel,
    @Req() request: Request,
  ) {
    let accessToken;
    if (request.headers.authorization) {
      accessToken = request.headers.authorization.split(' ')[1];
    }
    const posts = await this.blogsService.getAllPostsByBlog(
      blogId,
      sortData,
      accessToken,
    );
    if (!posts) {
      throw new NotFoundException(`Blog with id ${blogId} not found`);
    }
    return posts;
  }

  @SkipThrottle()
  @UseGuards(BasicAuthGuard)
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
