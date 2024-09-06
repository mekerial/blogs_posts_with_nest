import { Trim } from '../../../infrastructure/decorators/transform/trim';
import { IsString, Length } from 'class-validator';

export class LoginInputModel {
  @Trim()
  @IsString()
  @Length(5, 20, { message: 'login is incorrect!' })
  loginOrEmail: string;

  @IsString()
  @Length(6, 20, { message: 'Length not correct' })
  password: string;
}
