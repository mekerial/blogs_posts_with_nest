import { Module } from '@nestjs/common';
import { SecurityController } from './security.controller';
import { SecurityService } from './security.service';
import { SessionsRepository } from './sessions.repository';
import { JwtService } from '../../applications/jwt/jwt.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from './schemas/session.schema';
import {
  RefreshToken,
  RefreshTokenSchema,
} from '../../applications/jwt/resfreshToken.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Session.name, schema: SessionSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
  ],
  controllers: [SecurityController],
  providers: [SecurityService, SessionsRepository, JwtService],
})
export class SecurityModule {}
