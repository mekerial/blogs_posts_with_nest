import { IsEnum, IsString, Length } from 'class-validator';

export class CreatePostModel {
  @IsString()
  @Length(1, 30, { message: 'Length title is incorrect' })
  title: string;

  @IsString()
  @Length(1, 100, { message: 'Length shortDescription is incorrect' })
  shortDescription: string;

  @IsString()
  @Length(1, 1000, { message: 'Length content is incorrect' })
  content: string;

  blogId: string;
}

export class CreatePostModelByBlog {
  @IsString()
  @Length(1, 30, { message: 'Length title is incorrect' })
  title: string;

  @IsString()
  @Length(1, 100, { message: 'Length shortDescription is incorrect' })
  shortDescription: string;

  @IsString()
  @Length(1, 1000, { message: 'Length content is incorrect' })
  content: string;
}

export class UpdatePostModel {
  @IsString()
  @Length(1, 30, { message: 'Length title is incorrect' })
  title?: string;

  @IsString()
  @Length(1, 100, { message: 'Length shortDescription is incorrect' })
  shortDescription?: string;

  @IsString()
  @Length(1, 1000, { message: 'Length content is incorrect' })
  content?: string;

  blogId?: string;

  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
  };
}

export enum LikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

// Шаг 2: Создаем DTO для валидации входных данных
export class LikeStatusDto {
  @IsEnum(LikeStatus, {
    message: 'likeStatus must be either Like, Dislike, or None',
  })
  likeStatus: LikeStatus;
}

export type NewestLike = {
  userId: string;
  status: string;
  createdAt: Date;
};

export type PostDbModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    newestLikes: NewestLike[];
  };
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
    newestLikes: [];
  };
};
