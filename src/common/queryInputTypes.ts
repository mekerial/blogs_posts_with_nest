export type QueryUserInputModel = {
  sortBy?: string;
  sortDirection?: string;
  pageNumber?: number;
  pageSize?: number;
  searchLoginTerm?: string;
  searchEmailTerm?: string;
};

export type QueryBlogInputModel = {
  searchNameTerm?: string;
  sortBy?: string;
  sortDirection?: string;
  pageNumber?: number;
  pageSize?: number;
};

export type QueryPostInputModel = {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: string;
};

export type QueryCommentInputModel = {
  sortBy?: string;
  sortDirection?: string;
  pageNumber?: number;
  pageSize?: number;
};
