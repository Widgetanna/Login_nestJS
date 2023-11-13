import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'toto', //configService.get('JWT_SECRET'),
    });
    console.log('JWT_SECRET:', configService.get('JWT_SECRET'));
  }

  async validate(payload: any) {
    //{ ...payload.user };
    return { ...payload.user };
  }
}
