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
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '../../infrastructure/guards/auth.guard';
import { CommentCreateModel } from './types/comment.types';
import { Request, Response } from 'express';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

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
}
