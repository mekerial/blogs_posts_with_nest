import { Controller, Delete, HttpCode } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema';
import { PostDocument } from '../posts/schemas/post.schema';
import { BlogDocument } from '../blogs/schemas/blog.schema';
import { CommentDocument } from '../comments/schemas/comment.schema';
import { CommentLikeDocument } from '../likes/schemas/commentLikeSchema';
import { PostLikeDocument } from '../likes/schemas/postLikeSchema';

@Controller('testing')
export class UtilsController {
  constructor(
    @InjectModel('Blog') private blogModel: Model<BlogDocument>,
    @InjectModel('Post') private postModel: Model<PostDocument>,
    @InjectModel('User') private userModel: Model<UserDocument>,
    @InjectModel('Comment') private commentModel: Model<CommentDocument>,
    @InjectModel('CommentLike')
    private commentLikeModel: Model<CommentLikeDocument>,
    @InjectModel('PostLike') private postLikeModel: Model<PostLikeDocument>,
  ) {}
  @Delete('all-data')
  @HttpCode(204)
  async dropDatabase() {
    await this.blogModel.deleteMany({});
    await this.postModel.deleteMany({});
    await this.userModel.deleteMany({});
    await this.commentModel.deleteMany({});
    await this.commentLikeModel.deleteMany({});
    await this.postLikeModel.deleteMany({});

    return;
  }
}
