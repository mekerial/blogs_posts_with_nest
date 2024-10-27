import {
  Controller,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  Req,
  Res,
  Get,
  HttpCode,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '../../infrastructure/guards/auth.guard';
import { CommentCreateModel } from './types/comment.types';
import { request, Request, Response } from 'express';
import { LikeStatusDto } from '../posts/types/post.types';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('/:id')
  async getComment(@Param('id') commentId: string, @Req() request: Request) {
    let accessToken;
    if (request.headers.authorization) {
      accessToken = request.headers.authorization.split(' ')[1];
    }
    const findComment = await this.commentsService.getComment(
      commentId,
      accessToken,
    );
    if (!findComment) {
      throw new NotFoundException(`Comment with id ${commentId} not found`);
    }

    return findComment;
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  async editComment(
    @Param('id') commentId: string,
    @Body() inputData: CommentCreateModel,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userId = request.userId.toString();
    const editComment = await this.commentsService.editComment(
      userId,
      commentId,
      inputData.content,
    );
    if (editComment.status === 404) {
      throw new NotFoundException();
    }
    if (editComment.status === 403) {
      response.sendStatus(403);
    }
    return;
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  async deleteComment(@Param('id') commentId: string) {
    const deleteComment = await this.commentsService.deleteComment(commentId);
    return deleteComment;
  }

  @Put('/:id/like-status')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async likeComment(
    @Param('id') commentId: string,
    @Body() statusData: LikeStatusDto,
    @Req() request: Request,
  ) {
    const likeComment = await this.commentsService.createLikeStatusComment(
      commentId,
      statusData.likeStatus,
      request.userId.toString(),
    );
    if (!likeComment) {
      throw new NotFoundException(`Comment with id ${commentId} not found`);
    }
    return commentId;
  }
}
