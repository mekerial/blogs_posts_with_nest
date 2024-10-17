import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LikeDocument = HydratedDocument<Like>;
@Schema()
export class Like {
  @Prop({ required: true }) userId: string;

  @Prop({ required: true }) postId: string;

  @Prop({ required: true }) status: string;

  @Prop({ required: true }) addedAt: string;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
