import { IsString, Length } from 'class-validator';
import { Trim } from '../../../infrastructure/decorators/transform/trim';

export class CommentCreateModel {
  @Trim()
  @IsString()
  @Length(20, 300, { message: 'Length is incorrect!' })
  content: string;
}

export class UpdateCommentModel {
  @Trim()
  @IsString()
  @Length(20, 300, { message: 'Length is incorrect!' })
  content?: string;
  commentatorInfo?: {
    userId?: string;
    userLogin?: string;
  };
  createdAt?: Date;
  likesInfo?: {
    likesCount?: number;
    dislikesCount?: number;
  };
}

export type CommentDbModel = {
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
  };
  postId: string;
};
