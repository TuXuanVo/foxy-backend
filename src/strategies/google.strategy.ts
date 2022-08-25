import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_REDIRECT_URL,
            scope: ['email', 'profile'],
        });
    }

    async validate(_accessToken: string, _refreshToken: string, profile: any, done: VerifyCallback): Promise<void> {
        const { name, emails, photos } = profile;
        done(null, {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            avatar: photos[0].value,
        });
    }
}
