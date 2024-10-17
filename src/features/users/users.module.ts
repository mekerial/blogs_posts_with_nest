import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSchema } from './schemas/user.schema';
import { UsersRepository } from './users.repository';
import { PasswordService } from '../../applications/password.service';
import { JwtService } from '../../applications/jwt.service';
import { NameIsExistConstraint } from '../../infrastructure/decorators/validate/name-is-exist.decorator';
import { PasswordRecoverySchema } from './schemas/passwords-recovery.schema';
import { EmailIsExistConstraint } from '../../infrastructure/decorators/validate/email-is-exist.decorator';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'PasswordRecovery', schema: PasswordRecoverySchema },
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
  ],
})
export class UsersModule {}
