export type CreatePostModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

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
