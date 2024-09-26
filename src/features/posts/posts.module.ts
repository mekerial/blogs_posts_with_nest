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

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Blog', schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }]),
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: 'PasswordRecovery', schema: PasswordRecoverySchema },
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
  ],
})
export class PostsModule {}
