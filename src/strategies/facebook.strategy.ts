import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor() {
        super({
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: `${process.env.FACEBOOK_REDIRECT_URL}`,
            scope: 'email',
            profileFields: ['emails', 'name', 'photos'],
        });
    }

    async validate(
        _accessToken: string,
        _refreshToken: string,
        profile: Profile,
        done: (err: any, user: any, info?: any) => void,
    ): Promise<void> {
        const { name, emails, photos } = profile;
        done(null, {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            avatar: photos[0].value,
        });
    }
}
