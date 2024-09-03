import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { UsersModule } from './users/users.module';
import { BlogsModule } from './blogs/blogs.module';
import { UtilsModule } from './utils/utils.module';
import { PostsModule } from './posts/posts.module';
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
