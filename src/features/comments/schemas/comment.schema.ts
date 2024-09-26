import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
class CommentatorInfo {
  @Prop({ required: true })
  userId: string;
  @Prop({ required: true })
  userLogin: string;
}

@Schema()
class LikesInfo {
  @Prop({ required: true })
  likesCount: number;
  @Prop({ required: true })
  dislikesCount: number;
}

@Schema()
export class Comment {
  @Prop({ required: true })
  content: string;

  @Prop({ type: CommentatorInfo, required: true })
  commentatorInfo: CommentatorInfo;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ type: LikesInfo, required: true })
  likesInfo: LikesInfo;

  @Prop({ required: true })
  postId: string;
}
export const CommentSchema = SchemaFactory.createForClass(Comment);
