import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '../../applications/jwt/jwt.service';
import { UsersService } from '../users/users.service';
import { PasswordService } from '../../applications/password.service';
import { UsersRepository } from '../users/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../users/schemas/user.schema';
import {
  PasswordRecovery,
  PasswordRecoverySchema,
} from '../users/schemas/passwords-recovery.schema';
import {
  RefreshToken,
  RefreshTokenSchema,
} from '../../applications/jwt/resfreshToken.schema';
import { Session, SessionSchema } from '../security/schemas/session.schema';
import { SessionsRepository } from '../security/sessions.repository';
import { SecurityService } from '../security/security.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: PasswordRecovery.name, schema: PasswordRecoverySchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    UsersService,
    PasswordService,
    UsersRepository,
    SessionsRepository,
    SecurityService,
  ],
})
export class AuthModule {}
