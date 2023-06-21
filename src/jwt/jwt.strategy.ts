import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {
        super({
            usernameField: 'userAccessToken',
            passwordField: 'userRefreshToken',
        });
    }
}