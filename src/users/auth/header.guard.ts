import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class HeaderGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    const headerKey = req.headers['x-wallet-b2b-key'];

    const VALID_KEY = "G2a8-SuperClaveSecreta-Billetera-2025-XyZ";

    return headerKey === VALID_KEY;
  }
}