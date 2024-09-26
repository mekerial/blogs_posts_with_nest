import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '../../applications/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(protected jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authJwtToken = request.headers.authorization;
    if (!authJwtToken) {
      throw new UnauthorizedException();
    }
    const token = authJwtToken.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException();
    }

    const userId = this.jwtService.getUserIdByAccessToken(token);
    if (!userId) {
      throw new UnauthorizedException();
    }

    request.userId = userId;

    return true;
  }
}
