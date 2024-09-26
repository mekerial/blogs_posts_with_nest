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

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: 'PasswordRecovery', schema: PasswordRecoverySchema },
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
  ],
})
export class CommentsModule {}
