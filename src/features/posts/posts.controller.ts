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
import {
  CreatePostModel,
  LikeStatusDto,
  UpdatePostModel,
} from './types/post.types';
import { HttpExceptionFilter } from '../../infrastructure/exception-filters/http-exception-filter';
import { CommentsService } from '../comments/comments.service';
import { CommentCreateModel } from '../comments/types/comment.types';
import { AuthGuard } from '../../infrastructure/guards/auth.guard';
import { Request } from 'express';
import { BasicAuthGuard } from '../../infrastructure/guards/basic-auth.guard';

@UseFilters(HttpExceptionFilter)
@Controller('posts')
export class PostsController {
  constructor(
    protected postsService: PostsService,
    protected commentsService: CommentsService,
  ) {}
  @Get()
  async getAllPosts(
    @Query() sortData: QueryPostInputModel,
    @Req() request: Request,
  ) {
    console.log('GET /posts');

    let accessToken;
    if (request.headers.authorization) {
      accessToken = request.headers.authorization.split(' ')[1];
    }
    return await this.postsService.getAllPosts(sortData, accessToken);
  }
  @Get(':id')
  async getPost(@Param('id') postId: string, @Req() request: Request) {
    console.log('GET /posts/:id');

    let accessToken;
    if (request.headers.authorization) {
      accessToken = request.headers.authorization.split(' ')[1];
    }
    const post = await this.postsService.getPost(postId, accessToken);
    if (!post) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }
    return post;
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  async createPost(@Body() inputModel: CreatePostModel) {
    console.log('POST /posts');

    const createPost = await this.postsService.createPost(inputModel);
    if (!createPost) {
      throw new NotFoundException(
        `Blog with id ${inputModel.blogId} not found`,
      );
    }
    return createPost;
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(204)
  async updatePost(
    @Param('id') postId: string,
    @Body() updateData: UpdatePostModel,
  ) {
    console.log('PUT /posts/:id');

    const updatePost = await this.postsService.updatePost(postId, updateData);
    if (!updatePost) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }
    return updatePost;
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deletePost(@Param('id') postId: string) {
    console.log('DELETE /posts/:id');

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
    @Req() request: Request,
  ) {
    console.log('GET /posts/:id/comments');

    let accessToken;
    if (request.headers.authorization) {
      accessToken = request.headers.authorization.split(' ')[1];
    }

    const findComments = await this.commentsService.getAllComments(
      postId,
      sortData,
      accessToken,
    );
    if (!findComments) {
      throw new NotFoundException('Not found post');
    }
    return findComments;
  }

  @Post(':id/comments')
  @UseGuards(AuthGuard)
  async createComment(
    @Param('id') postId: string,
    @Body() inputData: CommentCreateModel,
    @Req() request: Request,
  ) {
    console.log('POST /posts/:id/comments');

    const createComment = await this.commentsService.createComment(
      postId,
      inputData,
      request.userId.toString(),
    );
    if (!createComment) {
      throw new NotFoundException();
    }
    return createComment;
  }

  @Put(':id/like-status')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async likePost(
    @Param('id') postId: string,
    @Body() statusData: LikeStatusDto,
    @Req() request: Request,
  ) {
    console.log('POST /posts/:id/like-status');

    const likePost = await this.postsService.createLikeStatusPost(
      postId,
      statusData.likeStatus,
      request.userId.toString(),
    );
    if (!likePost) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }
    return likePost;
  }
}
