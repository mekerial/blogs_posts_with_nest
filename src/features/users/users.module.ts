import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';
import { UsersRepository } from './users.repository';
import { PasswordService } from '../../applications/password.service';
import { JwtService } from '../../applications/jwt/jwt.service';
import { NameIsExistConstraint } from '../../infrastructure/decorators/validate/name-is-exist.decorator';
import {
  PasswordRecovery,
  PasswordRecoverySchema,
} from './schemas/passwords-recovery.schema';
import { EmailIsExistConstraint } from '../../infrastructure/decorators/validate/email-is-exist.decorator';
import {
  RefreshToken,
  RefreshTokenSchema,
} from '../../applications/jwt/resfreshToken.schema';
import { SessionsRepository } from '../security/sessions.repository';
import { Session, SessionSchema } from '../security/schemas/session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: PasswordRecovery.name, schema: PasswordRecoverySchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    PasswordService,
    JwtService,
    NameIsExistConstraint,
    EmailIsExistConstraint,
    SessionsRepository,
  ],
})
export class UsersModule {}
