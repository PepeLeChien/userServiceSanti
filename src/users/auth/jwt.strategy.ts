import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {

    const secret = process.env.JWT_SECRET;
    const issuer = process.env.JWT_ISSUER;

    if (!secret) throw new Error('JWT_SECRET missing');
    if (!issuer) throw new Error('JWT_ISSUER missing');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret, 
      algorithms: ['HS256'], 
      issuer: issuer,
    });
  }

  validate(payload: any) {
    return {
      username: payload.sub,
      userId: payload.userId,
      authorities: payload.authorities,
    };
  }
}
