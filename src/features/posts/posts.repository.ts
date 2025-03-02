import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, SortOrder } from 'mongoose';
import { PostDbModel, UpdatePostModel } from './types/post.types';
import { Post, PostDocument } from './schemas/post.schema';
import { QueryPostInputModel } from '../../common/queryInputTypes';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async getAllPosts(sortData: QueryPostInputModel) {
    const pageNumber = sortData.pageNumber ?? 1;
    const pageSize = +(sortData.pageSize ?? 10);
    const sortBy = sortData.sortBy ?? 'createdAt';
    const sortDirection = sortData.sortDirection ?? 'desc';
    const sortOptions: Record<string, SortOrder> = {
      [sortBy]: sortDirection === 'desc' ? (-1 as SortOrder) : (1 as SortOrder),
    };
    const posts = await this.postModel
      .find({})
      .sort(sortOptions)
      .skip((+pageNumber - 1) * pageSize)
      .limit(+pageSize)
      .lean()
      .exec();

    const totalCount = await this.postModel.countDocuments({});

    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page: +pageNumber,
      pageSize: pageSize,
      totalCount,
      items: posts,
    };
  }

  async getPost(postId: string) {
    if (mongoose.Types.ObjectId.isValid(postId)) {
      const post = await this.postModel.findById(postId).exec();

      return post;
    }
    return;
  }

  async createPost(post: PostDbModel) {
    return await this.postModel.create(post);
  }

  async updatePost(postId: string, updateData: UpdatePostModel) {
    const updatePost = await this.postModel.updateOne(
      { _id: postId },
      {
        $set: {
          title: updateData.title,
          shortDescription: updateData.shortDescription,
          content: updateData.content,
        },
      },
    );
    return updatePost;
  }

  async updatePostLikesInfo(postId: string, updateData: UpdatePostModel) {
    const updatePost = await this.postModel.updateOne(
      { _id: postId },
      {
        $set: {
          title: updateData.title,
          shortDescription: updateData.shortDescription,
          content: updateData.content,
          extendedLikesInfo: {
            likesCount: updateData.extendedLikesInfo.likesCount,
            dislikesCount: updateData.extendedLikesInfo.dislikesCount,
          },
        },
      },
    );
    return updatePost;
  }

  async getAllPostsByBlogId(blogId: string, sortData: QueryPostInputModel) {
    const pageNumber = sortData.pageNumber ?? 1;
    const pageSize = +(sortData.pageSize ?? 10);
    const sortBy = sortData.sortBy ?? 'createdAt';
    const sortDirection = sortData.sortDirection ?? 'desc';
    const sortOptions: Record<string, SortOrder> = {
      [sortBy]: sortDirection === 'desc' ? (-1 as SortOrder) : (1 as SortOrder),
    };
    const posts = await this.postModel
      .find({ blogId: blogId })
      .sort(sortOptions)
      .skip((+pageNumber - 1) * pageSize)
      .limit(+pageSize)
      .lean()
      .exec();

    const totalCount = await this.postModel.countDocuments({ blogId: blogId });

    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page: +pageNumber,
      pageSize: pageSize,
      totalCount,
      items: posts,
    };
  }

  async deletePost(postId: string) {
    return await this.postModel.deleteOne({ _id: postId });
  }
}
