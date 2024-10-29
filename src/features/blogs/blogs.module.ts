import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './schemas/blog.schema';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { BlogsRepository } from './blogs.repository';
import { Post, PostSchema } from '../posts/schemas/post.schema';
import { PostsRepository } from '../posts/posts.repository';
import { JwtService } from '../../applications/jwt/jwt.service';
import { PostMappers } from '../posts/types/mappers';
import { PostLikeRepository } from '../likes/postLike.repository';
import { PostLike, PostLikeSchema } from '../likes/schemas/postLikeSchema';
import { UsersRepository } from '../users/users.repository';
import { User, UserSchema } from '../users/schemas/user.schema';
import {
  PasswordRecovery,
  PasswordRecoverySchema,
} from '../users/schemas/passwords-recovery.schema';
import { PasswordService } from '../../applications/password.service';
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
      { name: PostLike.name, schema: PostLikeSchema },
      { name: User.name, schema: UserSchema },
      { name: PasswordRecovery.name, schema: PasswordRecoverySchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
  ],
  controllers: [BlogsController],
  providers: [
    BlogsService,
    BlogsRepository,
    PostsRepository,
    JwtService,
    PostMappers,
    PostLikeRepository,
    PasswordService,
    UsersRepository,
    SessionsRepository,
  ],
})
export class BlogsModule {}
