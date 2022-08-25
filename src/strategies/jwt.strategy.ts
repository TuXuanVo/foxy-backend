import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: JWT_Info) {
        const { _id, email, role, isVerify } = payload;
        // if (!isVerify) throw new UnauthorizedException('Please verify your account');
        return { _id, email, role: role ? role : 'user', isVerify };
    }
}
