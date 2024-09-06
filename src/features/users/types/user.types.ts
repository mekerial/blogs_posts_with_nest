import { IsString, Length } from 'class-validator';
import { Trim } from '../../../infrastructure/decorators/transform/trim';
import { isOptionalEmail } from '../../../infrastructure/decorators/validate/is-optional-email';
import { NameIsExist } from '../../../infrastructure/decorators/validate/name-is-exist.decorator';

export class CreateUserInputModelType {
  @Trim()
  @IsString()
  @Length(5, 20, { message: 'login is incorrect!' })
  @NameIsExist()
  login: string;

  @Trim()
  @IsString()
  @isOptionalEmail()
  email: string;

  @IsString()
  @Length(6, 20, { message: 'Length not correct' })
  password: string;
}

export type UserDbModel = {
  accountData: {
    login: string;
    passwordHash: string;
    passwordSalt: string;
    email: string;
    createdAt: string;
  };
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: string;
    isConfirmed: boolean;
  };
};

export type UserViewModel = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};
