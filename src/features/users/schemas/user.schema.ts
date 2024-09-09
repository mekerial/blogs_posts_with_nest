import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = HydratedDocument<User>;
@Schema()
class AccountData {
  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  passwordSalt: string;

  @Prop({ default: new Date().toISOString() })
  createdAt: string;
}
@Schema()
class EmailConfirmation {
  @Prop()
  confirmationCode: string;

  @Prop()
  expirationDate: Date;

  @Prop({ default: false })
  isConfirmed: boolean;
}
@Schema()
export class User {
  @Prop({ type: AccountData, required: true })
  accountData: AccountData;

  @Prop({ type: EmailConfirmation, required: true })
  emailConfirmation: EmailConfirmation;
}
export const UserSchema = SchemaFactory.createForClass(User);
