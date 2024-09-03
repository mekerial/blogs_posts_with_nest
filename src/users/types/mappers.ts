import { HydratedDocument } from 'mongoose';
import { UserViewModel } from './user.types';
import { User } from '../schemas/user.schema';

export async function transformUserToViewModel(users: any[]) {
  const usersViewModel: UserViewModel[] = [];
  for (let i = 0; i < users.length; i++) {
    const user = users[i] as HydratedDocument<User>;
    usersViewModel.push({
      id: user._id.toString(),
      login: user.accountData.login,
      email: user.accountData.email,
      createdAt: user.accountData.createdAt,
    });
  }
  return usersViewModel;
}
