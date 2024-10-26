import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogSchema } from './schemas/blog.schema';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { BlogsRepository } from './blogs.repository';
import { PostSchema } from '../posts/schemas/post.schema';
import { PostsRepository } from '../posts/posts.repository';
import { JwtService } from '../../applications/jwt.service';
import { PostMappers } from '../posts/types/mappers';
import { PostLikeRepository } from '../likes/postLike.repository';
import { PostLikeSchema } from '../likes/schemas/postLikeSchema';
import { UsersRepository } from '../users/users.repository';
import { UserSchema } from '../users/schemas/user.schema';
import { PasswordRecoverySchema } from '../users/schemas/passwords-recovery.schema';
import { PasswordService } from '../../applications/password.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Blog', schema: BlogSchema },
      { name: 'Post', schema: PostSchema },
      { name: 'PostLike', schema: PostLikeSchema },
      { name: 'User', schema: UserSchema },
      { name: 'PasswordRecovery', schema: PasswordRecoverySchema },
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
  ],
})
export class BlogsModule {}
