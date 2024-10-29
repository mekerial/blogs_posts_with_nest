import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schemas/post.schema';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsRepository } from './posts.repository';
import { BlogsRepository } from '../blogs/blogs.repository';
import { Blog, BlogSchema } from '../blogs/schemas/blog.schema';
import { CommentsService } from '../comments/comments.service';
import { CommentsRepository } from '../comments/comments.repository';
import { Comment, CommentSchema } from '../comments/schemas/comment.schema';
import { JwtService } from '../../applications/jwt/jwt.service';
import { UsersService } from '../users/users.service';
import { UsersRepository } from '../users/users.repository';
import { User, UserSchema } from '../users/schemas/user.schema';
import { PasswordService } from '../../applications/password.service';
import {
  PasswordRecovery,
  PasswordRecoverySchema,
} from '../users/schemas/passwords-recovery.schema';
import { PostLike, PostLikeSchema } from '../likes/schemas/postLikeSchema';
import { PostLikeRepository } from '../likes/postLike.repository';
import { PostMappers } from './types/mappers';
import { BlogIdIsValidConstraint } from '../../infrastructure/decorators/validate/objectId-validator';
import { CommentMappers } from '../comments/types/mappers';
import { CommentLikeRepository } from '../likes/commentLike.repository';
import {
  CommentLike,
  CommentLikeSchema,
} from '../likes/schemas/commentLikeSchema';
import {
  RefreshToken,
  RefreshTokenSchema,
} from '../../applications/jwt/resfreshToken.schema';
import { SessionsRepository } from '../security/sessions.repository';
import { Session, SessionSchema } from '../security/schemas/session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: User.name, schema: UserSchema },
      { name: PasswordRecovery.name, schema: PasswordRecoverySchema },
      { name: PostLike.name, schema: PostLikeSchema },
      { name: CommentLike.name, schema: CommentLikeSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    PostsRepository,
    BlogsRepository,
    CommentsService,
    CommentsRepository,
    JwtService,
    UsersService,
    UsersRepository,
    PasswordService,
    PostLikeRepository,
    PostMappers,
    BlogIdIsValidConstraint,
    CommentMappers,
    CommentLikeRepository,
    SessionsRepository,
  ],
})
export class PostsModule {}
