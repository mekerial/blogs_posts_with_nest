import { IsString, Length } from 'class-validator';

export class CreatePostModel {
  @IsString()
  @Length(0, 30, { message: 'Length title is incorrect' })
  title: string;

  @IsString()
  @Length(0, 100, { message: 'Length shortDescription is incorrect' })
  shortDescription: string;

  @IsString()
  @Length(0, 1000, { message: 'Length content is incorrect' })
  content: string;

  blogId: string;
}

export type CreatePostModelByBlog = {
  title: string;
  shortDescription: string;
  content: string;
};

export type UpdatePostModel = {
  title?: string;
  shortDescription?: string;
  content?: string;
  blogId?: string;
};

export type PostDbModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

export type PostViewModel = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: string[];
  };
};
