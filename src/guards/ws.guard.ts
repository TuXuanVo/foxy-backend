import { CanActivate, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class WsGuard implements CanActivate {
    constructor(private jwt: JwtService) {}
    canActivate(context: any): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
        const bearerToken = context.args[0].handshake.headers.authorization.split(' ')[1];
        try {
            const { _id } = this.jwt.verify(bearerToken, {
                secret: process.env.JWT_SECRET,
            });
            context.args[0].handshake.headers.user = _id;
            return true;
        } catch (ex) {
            console.log(ex);
            return false;
        }
    }
}
