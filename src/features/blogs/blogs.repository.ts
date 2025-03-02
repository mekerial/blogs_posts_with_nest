import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './schemas/blog.schema';
import mongoose, { Model, SortOrder } from 'mongoose';
import { QueryBlogInputModel } from '../../common/queryInputTypes';
import { transformBlogToViewModel } from './types/mappers';
import { CreateBlogModel } from './types/blog.types';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}
  async getAllBlogs(sortData: QueryBlogInputModel) {
    const searchNameTerm = sortData.searchNameTerm ?? null;
    const sortBy = sortData.sortBy ?? 'createdAt';
    const sortDirection = sortData.sortDirection ?? 'desc';
    const pageNumber = sortData.pageNumber ?? 1;
    const pageSize = sortData.pageSize ?? 10;

    let filter = {};

    if (searchNameTerm) {
      filter = {
        name: {
          $regex: searchNameTerm,
          $options: 'i',
        },
      };
    }

    const sortOptions: Record<string, SortOrder> = {
      [sortBy]: sortDirection === 'desc' ? (-1 as SortOrder) : (1 as SortOrder),
    };
    const blogs = await this.blogModel
      .find(filter)
      .sort(sortOptions)
      .skip((pageNumber - 1) * pageSize)
      .limit(+pageSize)
      .lean()
      .exec();
    const totalCount = await this.blogModel.countDocuments(filter);

    const pagesCount = Math.ceil(totalCount / +pageSize);

    const blogsViewModel = await transformBlogToViewModel(blogs);

    return {
      page: +pageNumber,
      pageSize: +pageSize,
      pagesCount,
      totalCount,
      items: blogsViewModel,
    };
  }

  async getBlog(blogId: string) {
    if (mongoose.Types.ObjectId.isValid(blogId)) {
      const findBlog = await this.blogModel.findById(blogId).lean().exec();
      return findBlog;
    }
    return;
  }

  async createBlog(blogData: CreateBlogModel) {
    const newBlog = {
      ...blogData,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    return await this.blogModel.create(newBlog);
  }

  async deleteBlog(blogId: string) {
    const objectId = new mongoose.Types.ObjectId(blogId);
    const deleteBlog = await this.blogModel.deleteOne({ _id: objectId }).exec();
    return !!deleteBlog.deletedCount;
  }

  async updateBlog(blogId: string, InputModel: CreateBlogModel) {
    const objectId = new mongoose.Types.ObjectId(blogId);
    const updateBlog = await this.blogModel.updateOne(
      { _id: objectId },
      {
        $set: {
          name: InputModel.name,
          description: InputModel.description,
          websiteUrl: InputModel.websiteUrl,
        },
      },
    );
    if (!updateBlog) {
      return;
    }
    return updateBlog;
  }
}
