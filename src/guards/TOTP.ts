import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as speakeasy from 'speakeasy';

@Injectable()
export class TOTPGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const totpCode = request.headers['x-totp-code']; 
    const secret = 'KJZFISBMMERWORCUJJIWWLSCLI4GOT2RNMRWWOBBIVCX252RFZ2A';
    
    if (!totpCode) {
      throw new UnauthorizedException('Falta el código TOTP en los headers');
    }

    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: totpCode,
    });

    if (!verified) {
      throw new UnauthorizedException('Código TOTP inválido');
    }

    return true;
  }
}
