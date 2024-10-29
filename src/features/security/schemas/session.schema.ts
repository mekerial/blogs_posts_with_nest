import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SessionDocument = HydratedDocument<Session>;

@Schema()
export class Session {
  @Prop({ required: true }) issuedAt: string;
  @Prop({ required: true }) lastActiveDate: string;
  @Prop({ required: true }) deviceId: string;
  @Prop({ required: true }) ip: string;
  @Prop({ required: true }) deviceName: string;
  @Prop({ required: true }) userId: string;
  @Prop({ required: true }) refreshToken: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
