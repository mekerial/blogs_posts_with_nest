import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '../../applications/jwt.service';
import { UsersService } from '../users/users.service';
import { PasswordService } from '../../applications/password.service';
import { UsersRepository } from '../users/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../users/schemas/user.schema';
import { PasswordRecoverySchema } from '../users/schemas/passwords-recovery.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: 'PasswordRecovery', schema: PasswordRecoverySchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    UsersService,
    PasswordService,
    UsersRepository,
  ],
})
export class AuthModule {}
