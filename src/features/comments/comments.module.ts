import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema } from './schemas/comment.schema';
import { CommentsRepository } from './comments.repository';
import { PostsRepository } from '../posts/posts.repository';
import { PostSchema } from '../posts/schemas/post.schema';
import { UsersRepository } from '../users/users.repository';
import { UsersService } from '../users/users.service';
import { UserSchema } from '../users/schemas/user.schema';
import { PasswordRecoverySchema } from '../users/schemas/passwords-recovery.schema';
import { PasswordService } from '../../applications/password.service';
import { JwtService } from '../../applications/jwt.service';
import { CommentMappers } from './types/mappers';
import { CommentLikeRepository } from '../likes/commentLike.repository';
import { CommentLikeSchema } from '../likes/schemas/commentLikeSchema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Comment', schema: CommentSchema },
      { name: 'Post', schema: PostSchema },
      { name: 'User', schema: UserSchema },
      { name: 'PasswordRecovery', schema: PasswordRecoverySchema },
      { name: 'CommentLike', schema: CommentLikeSchema },
    ]),
  ],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    CommentsRepository,
    PostsRepository,
    UsersRepository,
    UsersService,
    PasswordService,
    JwtService,
    CommentMappers,
    CommentLikeRepository,
  ],
})
export class CommentsModule {}
