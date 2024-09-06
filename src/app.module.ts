import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { UsersModule } from './features/users/users.module';
import { BlogsModule } from './features/blogs/blogs.module';
import { UtilsModule } from './features/utils/utils.module';
import { PostsModule } from './features/posts/posts.module';
import { AuthModule } from './features/auth/auth.module';
dotenv.config();

const mongo_uri = process.env.MONGO_URI; // || 'mongodb://localhost:27017';
if (!mongo_uri) {
  throw new Error(' ! mongo_uri error ! ');
}

@Module({
  imports: [
    MongooseModule.forRoot(mongo_uri),
    UsersModule,
    BlogsModule,
    PostsModule,
    UtilsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
