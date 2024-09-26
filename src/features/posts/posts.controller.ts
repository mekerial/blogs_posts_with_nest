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
import { PostsService } from './posts.service';
import {
  QueryCommentInputModel,
  QueryPostInputModel,
} from '../../common/types';
import { CreatePostModel, UpdatePostModel } from './types/post.types';
import { HttpExceptionFilter } from '../../infrastructure/exception-filters/http-exception-filter';
import { CommentsService } from '../comments/comments.service';
import { CommentCreateModel } from '../comments/types/comment.types';
import { AuthGuard } from '../../infrastructure/guards/auth.guard';
import { Request } from 'express';

@UseFilters(HttpExceptionFilter)
@Controller('posts')
export class PostsController {
  constructor(
    protected postsService: PostsService,
    protected commentsService: CommentsService,
  ) {}
  @Get()
  async getAllPosts(@Query() sortData: QueryPostInputModel) {
    return await this.postsService.getAllPosts(sortData);
  }
  @Get(':id')
  async getPost(@Param('id') postId: string) {
    const post = await this.postsService.getPost(postId);
    if (!post) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }
    return post;
  }

  @Post()
  async createPost(@Body() inputModel: CreatePostModel) {
    const createPost = await this.postsService.createPost(inputModel);
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
    const updatePost = await this.postsService.updatePost(postId, updateData);
    if (!updatePost) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }
    return updatePost;
  }

  @Delete(':id')
  @HttpCode(204)
  async deletePost(@Param('id') postId: string) {
    const deletePost = await this.postsService.deletePost(postId);
    if (!deletePost) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }
    return deletePost;
  }

  @Get(':id/comments')
  async getAllComments(
    @Query() sortData: QueryCommentInputModel,
    @Param('id') postId: string,
  ) {
    return await this.commentsService.getAllComments(postId, sortData);
  }

  @Post(':id/comments')
  @UseGuards(AuthGuard)
  async createComment(
    @Param('id') postId: string,
    @Body() inputData: CommentCreateModel,
    @Req() request: Request,
  ) {
    return await this.commentsService.createComment(
      postId,
      inputData,
      request.userId.toString(),
    );
  }
}
