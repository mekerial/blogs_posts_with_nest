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
import { LikesPostRepository } from '../likes/likes.repository';
import { LikeSchema } from '../likes/schemas/like.schema';
import { UsersRepository } from '../users/users.repository';
import { UserSchema } from '../users/schemas/user.schema';
import { PasswordRecoverySchema } from '../users/schemas/passwords-recovery.schema';
import { PasswordService } from '../../applications/password.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Blog', schema: BlogSchema },
      { name: 'Post', schema: PostSchema },
      { name: 'Like', schema: LikeSchema },
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
    LikesPostRepository,
    PasswordService,
    UsersRepository,
  ],
})
export class BlogsModule {}
