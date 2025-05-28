import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtCombinedAuthGuard extends AuthGuard(['jwt', 'jwt-cookie']) {
  canActivate(context: ExecutionContext) {
    // This will try 'jwt' strategy first, then 'jwt-cookie' if the first fails
    return super.canActivate(context);
  }
}
