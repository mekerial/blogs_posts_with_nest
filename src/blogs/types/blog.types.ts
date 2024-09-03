export type CreateBlogModel = {
  name: string;
  description: string;
  websiteUrl: string;
};

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
