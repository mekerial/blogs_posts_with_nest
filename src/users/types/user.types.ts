export type CreateUserInputModelType = {
  login: string;
  email: string;
  password: string;
};

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
