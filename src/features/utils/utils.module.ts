import { Module } from '@nestjs/common';
import { UtilsController } from './utils.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../users/schemas/user.schema';
import { PostSchema } from '../posts/schemas/post.schema';
import { BlogSchema } from '../blogs/schemas/blog.schema';
import { CommentSchema } from '../comments/schemas/comment.schema';
import { CommentLikeSchema } from '../likes/schemas/commentLikeSchema';
import { PostLikeSchema } from '../likes/schemas/postLikeSchema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Blog', schema: BlogSchema },
      { name: 'Post', schema: PostSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Comment', schema: CommentSchema },
      { name: 'CommentLike', schema: CommentLikeSchema },
      { name: 'PostLike', schema: PostLikeSchema },
    ]),
  ],
  controllers: [UtilsController],
  providers: [],
})
export class UtilsModule {}
