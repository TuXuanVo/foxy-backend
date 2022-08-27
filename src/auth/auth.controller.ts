import { Body, Controller, Get, HttpStatus, Req, Res, UseGuards, Post } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { AuthLoginAdminDto, AuthOTPDto, AuthPhoneDto, AuthRegisterAdminDto, AuthSendOTPDto } from 'src/dto';
import { AuthLogin } from 'src/dto/response/Auth.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('/')
    @UseGuards(JwtGuard)
    async currentUser(@Req() req: Request): Promise<any> {
        return await this.authService.currentUser((req.user as JWT_Info)._id);
    }

    @Get('/facebook')
    @UseGuards(AuthGuard('facebook'))
    async facebookLogin(): Promise<HttpStatus> {
        return HttpStatus.OK;
    }

    @Get('/google')
    @UseGuards(AuthGuard('google'))
    async googleLogin(): Promise<HttpStatus> {
        return HttpStatus.OK;
    }

    @Get('/facebook/redirect')
    @UseGuards(AuthGuard('facebook'))
    async facebookLoginRedirect(@Req() req: Request, @Res() res: Response): Promise<any> {
        const response = await this.authService.socialLogin(req.user as SocialReponse);
        if ('redirectUrl' in response) {
            if (response.email) {
                res.cookie('userEmail', response.email, {
                    maxAge: 5 * 60 * 1000,
                });
            } else if (response.error) {
                res.cookie('errMessage', response.error, {
                    maxAge: 30 * 1000,
                });
            }
            res.redirect(response.redirectUrl);
        }
    }

    @Get('/google/redirect')
    @UseGuards(AuthGuard('google'))
    async googleLoginRedirect(@Req() req: Request, @Res() res: Response) {
        const response = await this.authService.socialLogin(req.user as SocialReponse);
        if ('redirectUrl' in response) {
            if (response.email) {
                res.cookie('userEmail', response.email, {
                    maxAge: 3 * 60 * 1000,
                });
            } else if (response.error) {
                res.cookie('errMessage', response.error, {
                    maxAge: 30 * 1000,
                });
            }
            res.redirect(response.redirectUrl);
        }
    }

    // @Post('/send-otp')
    // @ApiBearerAuth('access_token')
    // @UseGuards(JwtGuard)
    // async sendOtp(@Req() req: Request, @Res() res: Response) {
    //     res.send(await this.authService.sendOTP(req.user as JWT_Info));
    // }

    @Post('send-otp-register')
    async sendOtpRegister(@Body() authSendOTP: AuthSendOTPDto) {
        return await this.authService.sendOTPRegister(authSendOTP.email, authSendOTP.phone);
    }

    @Post('verify-otp')
    async verifyOtp(@Body() authOTP: AuthOTPDto) {
        return await this.authService.verifyOTP(authOTP.phone, authOTP.email, authOTP.otp);
    }

    @Post('phone/login')
    async phoneLogin(@Body() body: AuthPhoneDto) {
        return await this.authService.phoneLogin(body.phone);
    }

    //Admin Login
    @Post('/admin/register')
    async adminRegister(@Body() authRegisterAdmin: AuthRegisterAdminDto): Promise<AuthLogin> {
        return await this.authService.adminRegister(authRegisterAdmin);
    }
    @Post('/admin/login')
    async adminLogin(@Body() authLoginAdmin: AuthLoginAdminDto): Promise<AuthLogin> {
        return await this.authService.adminLogin(authLoginAdmin);
    }
}
