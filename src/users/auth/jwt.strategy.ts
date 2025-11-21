import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    
    const secret = configService.get<string>('JWT_SECRET');
    const issuer = configService.get<string>('JWT_ISSUER');

    if (!secret) throw new Error('JWT_SECRET no definido en .env');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
      // algorithms: ['HS256'], // Opcional, passport lo detecta usualmente
      // issuer: issuer, // Opcional validar el issuer aquí si no quieres ser estricto
    });
  }

  validate(payload: any) {
    if (!payload) {
        throw new UnauthorizedException();
    }
    return {
      username: payload.sub,
      userId: payload.userId,
      authorities: payload.authorities,
    };
  }
}