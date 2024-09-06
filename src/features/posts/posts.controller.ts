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
import { PostsService } from './posts.service';
import { QueryPostInputModel } from '../../common/types';
import { CreatePostModel, UpdatePostModel } from './types/post.types';
import { HttpExceptionFilter } from '../../infrastructure/exception-filters/http-exception-filter';

@UseFilters(HttpExceptionFilter)
@Controller('posts')
export class PostsController {
  constructor(protected postService: PostsService) {}
  @Get()
  async getAllPosts(@Query() sortData: QueryPostInputModel) {
    return await this.postService.getAllPosts(sortData);
  }
  @Get(':id')
  async getPost(@Param('id') postId: string) {
    const post = await this.postService.getPost(postId);
    if (!post) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }
    return post;
  }

  @Post()
  async createPost(@Body() inputModel: CreatePostModel) {
    const createPost = await this.postService.createPost(inputModel);
    if (!createPost) {
      throw new NotFoundException(
        `Blog with id ${inputModel.blogId} not found`,
      );
    }
    return createPost;
  }

  @Put(':id')
  @HttpCode(204)
  async updatePost(
    @Param('id') postId: string,
    @Body() updateData: UpdatePostModel,
  ) {
    const updatePost = await this.postService.updatePost(postId, updateData);
    if (!updatePost) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }
    return updatePost;
  }

  @Delete(':id')
  @HttpCode(204)
  async deletePost(@Param('id') postId: string) {
    const deletePost = await this.postService.deletePost(postId);
    if (!deletePost) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }
    return deletePost;
  }
}
