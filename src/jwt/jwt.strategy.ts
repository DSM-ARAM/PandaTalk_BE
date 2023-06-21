import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from './jwt.payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWTSECRET,
      ignoreExpiration: false,
    });
  }

//   async validate(payload: Payload) {
//     const user = payload.userLogID === '0'

//     if (user) {
//       return user; // request.user에 해당 내용을 넣어준다 (Passport 라이브러리가 해줌)
//     } else {
//       throw new UnauthorizedException('접근 오류');
//     }
//   }
}