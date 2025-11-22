import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { HeaderGuard } from './header.guard';

@Injectable()
export class OrGuard implements CanActivate {

  constructor(
    private readonly jwtGuard: JwtAuthGuard,
    private readonly headerGuard: HeaderGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    try {
      const jwtValid = await this.jwtGuard.canActivate(context);
      if (jwtValid) return true;
    } catch (_) {}

    try {
      const headerValid = await this.headerGuard.canActivate(context);
      if (headerValid) return true;
    } catch (_) {}

    return false;
  }
}