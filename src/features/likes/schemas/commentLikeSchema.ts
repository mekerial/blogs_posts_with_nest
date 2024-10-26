import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CommentLikeDocument = HydratedDocument<CommentLike>;

@Schema()
export class CommentLike {
  @Prop({ required: true }) userId: string;

  @Prop({ required: true }) commentId: string;

  @Prop({ required: true }) status: string;

  @Prop({ required: true }) addedAt: string;
}

export const CommentLikeSchema = SchemaFactory.createForClass(CommentLike);
