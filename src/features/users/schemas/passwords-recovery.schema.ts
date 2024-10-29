import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PasswordRecoveryDocument = HydratedDocument<PasswordRecovery>;
@Schema()
export class PasswordRecovery {
  @Prop({ required: true }) userId: string;
  @Prop({ required: true }) recoveryCode: string;
  @Prop({ required: true }) expirationDate: Date;
}
export const PasswordRecoverySchema =
  SchemaFactory.createForClass(PasswordRecovery);
