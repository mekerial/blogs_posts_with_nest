import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from './schemas/post.schema';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsRepository } from './posts.repository';
import { BlogsRepository } from '../blogs/blogs.repository';
import { BlogSchema } from '../blogs/schemas/blog.schema';
import { CommentsService } from '../comments/comments.service';
import { CommentsRepository } from '../comments/comments.repository';
import { CommentSchema } from '../comments/schemas/comment.schema';
import { JwtService } from '../../applications/jwt.service';
import { UsersService } from '../users/users.service';
import { UsersRepository } from '../users/users.repository';
import { UserSchema } from '../users/schemas/user.schema';
import { PasswordService } from '../../applications/password.service';
import { PasswordRecoverySchema } from '../users/schemas/passwords-recovery.schema';
import { PostLikeSchema } from '../likes/schemas/postLikeSchema';
import { PostLikeRepository } from '../likes/postLike.repository';
import { PostMappers } from './types/mappers';
import { BlogIdIsValidConstraint } from '../../infrastructure/decorators/validate/objectId-validator';
import { CommentMappers } from '../comments/types/mappers';
import { CommentLikeRepository } from '../likes/commentLike.repository';
import { CommentLikeSchema } from '../likes/schemas/commentLikeSchema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Blog', schema: BlogSchema },
      { name: 'Post', schema: PostSchema },
      { name: 'Comment', schema: CommentSchema },
      { name: 'User', schema: UserSchema },
      { name: 'PasswordRecovery', schema: PasswordRecoverySchema },
      { name: 'PostLike', schema: PostLikeSchema },
      { name: 'CommentLike', schema: CommentLikeSchema },
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
  ],
})
export class PostsModule {}
