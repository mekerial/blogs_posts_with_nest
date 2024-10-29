import { Module } from '@nestjs/common';
import { UtilsController } from './utils.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Post, PostSchema } from '../posts/schemas/post.schema';
import { Blog, BlogSchema } from '../blogs/schemas/blog.schema';
import { Comment, CommentSchema } from '../comments/schemas/comment.schema';
import {
  CommentLike,
  CommentLikeSchema,
} from '../likes/schemas/commentLikeSchema';
import { PostLike, PostLikeSchema } from '../likes/schemas/postLikeSchema';
import { Session, SessionSchema } from '../security/schemas/session.schema';
import {
  RefreshToken,
  RefreshTokenSchema,
} from '../../applications/jwt/resfreshToken.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: User.name, schema: UserSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: CommentLike.name, schema: CommentLikeSchema },
      { name: PostLike.name, schema: PostLikeSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
  ],
  controllers: [UtilsController],
  providers: [],
})
export class UtilsModule {}
