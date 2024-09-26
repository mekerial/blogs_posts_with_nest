import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '../../infrastructure/guards/auth.guard';
import { CommentCreateModel } from './types/comment.types';
import { Request } from 'express';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Put('/:id')
  @UseGuards(AuthGuard)
  async editComment(
    @Param('id') commentId: string,
    @Body() inputData: CommentCreateModel,
    @Req() request: Request,
  ) {
    const userId = request.userId.toString();
    const editComment = await this.commentsService.editComment(
      userId,
      commentId,
      inputData.content,
    );
    if (!editComment) {
      throw new NotFoundException();
    }
    return;
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  async deleteComment(@Param('id') commentId: string) {
    const deleteComment = await this.commentsService.deleteComment(commentId);
    return deleteComment;
  }
}
