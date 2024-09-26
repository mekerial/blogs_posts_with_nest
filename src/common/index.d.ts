import { UserDbModelWithId } from '../features/users/types/user.types';

declare global {
  declare namespace Express {
    export interface Request {
      userId: UserDbModelWithId | string | null;
    }
  }
}
