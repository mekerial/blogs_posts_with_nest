import { IsString, Length } from 'class-validator';

export class CreateBlogModel {
  @IsString()
  @Length(1, 15, { message: 'Length name is incorrect!' })
  name: string;

  @IsString()
  @Length(1, 100, { message: 'Length description is incorrect!' })
  description: string;

  @IsString()
  @Length(1, 100, { message: 'Length websiteUrl is incorrect!' })
  websiteUrl: string;
}

export type CreatePostBlogModel = {
  title: string;
  shortDescription: string;
  content: string;
};

export type UpdateBlogModel = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type BlogDbModel = {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

export type BlogViewModel = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};
