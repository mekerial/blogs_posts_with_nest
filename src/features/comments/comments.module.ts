import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { CommentsRepository } from './comments.repository';
import { PostsRepository } from '../posts/posts.repository';
import { Post, PostSchema } from '../posts/schemas/post.schema';
import { UsersRepository } from '../users/users.repository';
import { UsersService } from '../users/users.service';
import { User, UserSchema } from '../users/schemas/user.schema';
import {
  PasswordRecovery,
  PasswordRecoverySchema,
} from '../users/schemas/passwords-recovery.schema';
import { PasswordService } from '../../applications/password.service';
import { JwtService } from '../../applications/jwt/jwt.service';
import { CommentMappers } from './types/mappers';
import { CommentLikeRepository } from '../likes/commentLike.repository';
import {
  CommentLike,
  CommentLikeSchema,
} from '../likes/schemas/commentLikeSchema';
import {
  RefreshToken,
  RefreshTokenSchema,
} from '../../applications/jwt/resfreshToken.schema';
import { Session, SessionSchema } from '../security/schemas/session.schema';
import { SessionsRepository } from '../security/sessions.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Post.name, schema: PostSchema },
      { name: User.name, schema: UserSchema },
      { name: PasswordRecovery.name, schema: PasswordRecoverySchema },
      { name: CommentLike.name, schema: CommentLikeSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      { name: Session.name, schema: SessionSchema },
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
    SessionsRepository,
  ],
})
export class CommentsModule {}
