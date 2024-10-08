import { IsString, Length } from 'class-validator';
import { Trim } from '../../../infrastructure/decorators/transform/trim';
import { IsOptionalEmail } from '../../../infrastructure/decorators/validate/is-optional-email';
import { NameIsExist } from '../../../infrastructure/decorators/validate/name-is-exist.decorator';
import { EmailIsExist } from '../../../infrastructure/decorators/validate/email-is-exist.decorator';
import { ObjectId } from 'mongoose';

export class CreateUserInputModelType {
  @Trim()
  @IsString()
  @Length(3, 10, { message: 'login is incorrect!' })
  @NameIsExist()
  login: string;

  @Trim()
  @IsString()
  @IsOptionalEmail()
  @EmailIsExist()
  email: string;

  @IsString()
  @Length(6, 20, { message: 'Length not correct' })
  password: string;
}

export type CreateUserWithoutValidation = {
  login: string;
  email: string;
  password: string;
};

export class InputEmailModel {
  @Trim()
  @IsString()
  @IsOptionalEmail()
  email: string;
}

export class InputPasswordAndCode {
  @Trim()
  @IsString()
  newPassword: string;

  @Trim()
  @IsString()
  recoveryCode: string;
}

export class InputConfirmationCodeModel {
  @Trim()
  @IsString()
  code: string;
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

export type UserDbModelWithId = {
  _id: ObjectId;
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
