import { Module } from '@nestjs/common';
import { UtilsController } from './utils.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../users/schemas/user.schema';
import { PostSchema } from '../posts/schemas/post.schema';
import { BlogSchema } from '../blogs/schemas/blog.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Blog', schema: BlogSchema },
      { name: 'Post', schema: PostSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  controllers: [UtilsController],
  providers: [],
})
export class UtilsModule {}
