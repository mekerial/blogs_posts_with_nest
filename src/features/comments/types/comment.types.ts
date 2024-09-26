import { IsString, Length } from 'class-validator';

export class CommentCreateModel {
  @IsString()
  @Length(20, 300, { message: 'Length is incorrect!' })
  content: string;
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
