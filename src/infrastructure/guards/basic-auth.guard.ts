import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const basicAuth = request.headers.authorization;

    if (basicAuth !== 'Basic YWRtaW46cXdlcnR5') {
      throw new UnauthorizedException();
      return;
    }
    return true;
  }
}
