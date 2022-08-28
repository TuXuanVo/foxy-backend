import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectTwilio, TwilioClient } from 'nestjs-twilio';
import { AdminService } from 'src/admin/admin.service';
import {
    ACCOUNT_ALREADY_VERIFIED,
    ACCOUNT_IS_BLOCKED,
    ERROR_CREATE_USER_WITH_PHONE,
    ERROR_CREATE_USER_WITH_SOCIAL,
    ERROR_GET_CURRENT_USER,
    ERROR_LOGIN_WITH_PHONE,
    ERROR_SAVE_USER,
    ERROR_SEND_OTP,
    ERROR_UPDATE_USER_OTP_PHONE,
    ERROR_VERIFY_OTP,
    GET_CURRENT_USER_SUCCESSFULLY,
    LOGIN_PHONE_SUCCESSFULLY,
    LOGIN_SOCIAL_FAILED,
    LOGIN_SOCIAL_SUCCESSFULLY,
    OTP_EXPIRED,
    OTP_INVALID,
    PHONE_NUMBER_HAS_BEEN_USED,
    REGISTER_PHONE_SUCCESSFULLY,
    SEND_OTP_SUCCESSFULLY,
    USER_NOT_FOUND,
} from 'src/constance/responseCode';
import { AuthLoginAdminDto, AuthLoginSocialDto, AuthRegisterAdminDto } from 'src/dto';
import { AuthLogin, AuthHandleName, UserDto } from 'src/dto/response/Auth.dto';
import { handleResponse } from 'src/dto/response/Response.dto';
import { User, UserDocument } from 'src/schemas/user.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectMapper()
        private readonly mapper: Mapper,
        private readonly configService: ConfigService,
        private readonly userService: UserService,
        private readonly adminService: AdminService,
        private config: ConfigService,
        private jwt: JwtService,
        @InjectTwilio() private readonly twilioClient: TwilioClient,
    ) {}

    async currentUser(_id: string) {
        try {
            const user = await this.userService.findById(_id);
            if (!user)
                return handleResponse({
                    error: USER_NOT_FOUND,
                    statusCode: HttpStatus.NOT_FOUND,
                });
            return handleResponse({
                message: GET_CURRENT_USER_SUCCESSFULLY,
                data: {
                    token: await this.signToken(user._id, user.email, true),
                    user: this.mapper.map(
                        await user.populate([
                            { path: 'friends', select: 'email name avatar' },
                            { path: 'hobbies', select: 'name' },
                            { path: 'info.education', select: 'name' },
                            { path: 'info.beer', select: 'name' },
                            { path: 'gender', select: 'name' },
                        ]),
                        User as any,
                        UserDto,
                    ),
                },
            });
        } catch (error) {
            return handleResponse({
                error: error.response?.error || ERROR_GET_CURRENT_USER,
                statusCode: error.response?.statusCode || HttpStatus.BAD_REQUEST,
            });
        }
    }

    async signToken(_id: string, email: string, isVerify = false, role = 'user'): Promise<string> {
        const secret: string = this.config.get('JWT_SECRET');
        const payload: JWT_Info = {
            _id,
            email,
            isVerify,
            role,
        };
        return this.jwt.signAsync(payload, {
            expiresIn: this.config.get('JWT_EXPIRATION_TIME'),
            secret,
        });
    }

    handleName(firstName: string | undefined, lastName: string | undefined): AuthHandleName {
        const fullName = (firstName || '') + ' ' + (lastName || '');
        const nameSplit = fullName.split(' ').filter((c) => c !== '');
        const newLastName = nameSplit[nameSplit.length - 1];
        nameSplit.pop();
        const newFirstName = nameSplit.join(' ');
        return { firstName: newFirstName, lastName: newLastName };
    }

    async socialLogin(body: AuthLoginSocialDto) {
        try {
            const { email, firstName, lastName, avatar } = body;
            const user = await this.userService.findByEmail(email);
            const nameHandle = this.handleName(firstName, lastName);
            //* if user not found, create new user
            if (!user) {
                const newUser = await this.userService.create({
                    email,
                    firstName: nameHandle.firstName,
                    lastName: nameHandle.lastName,
                    avatar,
                });

                if (!newUser) {
                    return {
                        error: ERROR_CREATE_USER_WITH_SOCIAL,
                        redirectUrl: process.env.REDIRECT_VERIFY_LOGIN_PAGE,
                    };
                }

                //redirect to register phone page
                return {
                    email: newUser.email.toString(),
                    redirectUrl: process.env.REDIRECT_VERIFY_PHONE_PAGE,
                };
            }

            //* if user exist, check status is_active
            if (!user.status.isActive)
                return {
                    error: ACCOUNT_IS_BLOCKED,
                    redirectUrl: process.env.REDIRECT_VERIFY_LOGIN_PAGE,
                };

            //* if user exist, check status is_verified and phone
            if (!user.status.isVerified || !user.phone) {
                //redirect to register phone page

                return {
                    email: user.email.toString(),
                    redirectUrl: process.env.REDIRECT_VERIFY_PHONE_PAGE,
                };
            }

            //* if user exist and has phone, send otp
            await this.sendSMS(user.phone);
            await this.userService.updateOTPByEmail(user.email);

            //redirect to verify otp page

            return {
                email: user.email.toString(),
                redirectUrl: process.env.REDIRECT_VERIFY_OTP_PAGE,
            };
        } catch (error) {
            return {
                error: LOGIN_SOCIAL_FAILED,
                redirectUrl: process.env.REDIRECT_VERIFY_LOGIN_PAGE,
            };
        }
    }

    convertPhone(phone: string): string {
        let newPhone = phone;
        if (newPhone[0] === '0') {
            newPhone = '+84' + newPhone.substring(1);
        }
        return newPhone;
    }

    async sendSMS(phone: string) {
        try {
            const serviceSid = this.configService.get('TWILIO_VERIFICATION_SERVICE_SID');
            const phoneNumber = this.convertPhone(phone);
            return await this.twilioClient.verify
                .services(serviceSid)
                .verifications.create({ to: phoneNumber, channel: 'sms' });
        } catch (error) {
            console.log('error: ', error);
            return handleResponse({
                error: ERROR_SEND_OTP,
                statusCode: HttpStatus.BAD_REQUEST,
            });
        }
    }

    // Register phone for social
    async sendOTPRegister(email: string, phone: string) {
        try {
            const userWithPhone = await this.userService.findByPhone(phone);
            if (userWithPhone && userWithPhone.email !== email)
                return handleResponse({
                    error: PHONE_NUMBER_HAS_BEEN_USED,
                    statusCode: HttpStatus.BAD_REQUEST,
                });

            const user = await this.userService.findByEmail(email);
            if (!user)
                return handleResponse({
                    error: USER_NOT_FOUND,
                    statusCode: HttpStatus.NOT_FOUND,
                });

            if (user.status.isVerified)
                return handleResponse({
                    error: ACCOUNT_ALREADY_VERIFIED,
                    statusCode: HttpStatus.BAD_REQUEST,
                });

            const updateUser = await this.userService.updateOTPAndPhone(user.email, phone);
            if (!updateUser)
                return handleResponse({
                    error: ERROR_UPDATE_USER_OTP_PHONE,
                    statusCode: HttpStatus.BAD_REQUEST,
                });

            await this.sendSMS(phone);

            return handleResponse({
                message: SEND_OTP_SUCCESSFULLY,
            });
        } catch (error) {
            return handleResponse({
                error: error.response?.error || ERROR_SEND_OTP,
                statusCode: error.response?.statusCode || HttpStatus.BAD_REQUEST,
            });
        }
    }

    async verifyOTP(phone: string, email: string, otp: string) {
        try {
            let user: UserDocument;

            if (email) {
                user = await this.userService.findByEmail(email);
            } else if (phone) {
                user = await this.userService.findByPhone(phone);
            }

            // Check user exist
            if (!user)
                return handleResponse({
                    error: USER_NOT_FOUND,
                    statusCode: HttpStatus.NOT_FOUND,
                });

            if (!user.status.isActive)
                return handleResponse({
                    error: ACCOUNT_IS_BLOCKED,
                    statusCode: HttpStatus.UNAUTHORIZED,
                });

            //Check OTP expired
            if (+user.otp.expire < Date.now())
                return handleResponse({
                    error: OTP_EXPIRED,
                    statusCode: HttpStatus.BAD_REQUEST,
                });

            /* twillio handle */
            const serviceSid = this.configService.get('TWILIO_VERIFICATION_SERVICE_SID');
            const result = await this.twilioClient.verify
                .services(serviceSid)
                .verificationChecks.create({ to: this.convertPhone(user.phone), code: otp });

            if (!result.valid || result.status !== 'approved') {
                if (user.status.isVerified) {
                    user.otp.times -= 1;
                    const saveUser = await user.save();
                    if (!saveUser)
                        return handleResponse({
                            error: ERROR_SAVE_USER,
                            statusCode: HttpStatus.BAD_REQUEST,
                        });
                    // message = `OTP invalid! If you submit the wrong code ${user.otp.times} again, you will be locked out of your account.`;
                }

                return handleResponse({
                    error: OTP_INVALID,
                    statusCode: HttpStatus.BAD_REQUEST,
                });
            }

            user.otp.times = +process.env.OTP_MAX_TURN;
            user.status.isVerified = true;

            const responseSave = await user.save();
            if (!responseSave)
                return handleResponse({
                    error: ERROR_SAVE_USER,
                    statusCode: HttpStatus.BAD_REQUEST,
                });
            return handleResponse({
                message: LOGIN_SOCIAL_SUCCESSFULLY,
                data: {
                    token: await this.signToken(user._id, user.email, true),
                    user: this.mapper.map(
                        await user.populate([
                            { path: 'friends', select: 'email name avatar' },
                            { path: 'block', select: 'email name avatar' },
                            { path: 'hobbies', select: 'name' },
                            { path: 'info.education', select: 'name' },
                            { path: 'info.beer', select: 'name' },
                            { path: 'gender', select: 'name' },
                        ]),
                        User as any,
                        UserDto,
                    ),
                },
            });
        } catch (error) {
            console.log(error);
            return handleResponse({
                error: error.response?.error || ERROR_VERIFY_OTP,
                statusCode: error.response?.statusCode || HttpStatus.BAD_REQUEST,
            });
        }
    }

    // login and register with phone
    async phoneLogin(phone: string) {
        try {
            const user = await this.userService.findByPhone(phone);
            if (!user) {
                const newUser = await this.userService.createWithPhone({ phone });

                if (!newUser)
                    return handleResponse({
                        error: ERROR_CREATE_USER_WITH_PHONE,
                        statusCode: HttpStatus.BAD_REQUEST,
                    });

                //send OTP
                await this.sendSMS(newUser.phone);
                await this.userService.updateOTPByPhone(newUser.phone);

                return handleResponse({
                    message: REGISTER_PHONE_SUCCESSFULLY,
                });
            }

            if (!user.status.isActive)
                return handleResponse({
                    error: ACCOUNT_IS_BLOCKED,
                    statusCode: HttpStatus.FORBIDDEN,
                });

            //send OTP
            await this.sendSMS(user.phone);
            await this.userService.updateOTPByPhone(user.phone);

            return handleResponse({
                message: LOGIN_PHONE_SUCCESSFULLY,
            });
        } catch (error) {
            return handleResponse({
                error: error.response?.error || ERROR_LOGIN_WITH_PHONE,
                statusCode: error.response?.statusCode || HttpStatus.BAD_REQUEST,
            });
        }
    }

    async adminRegister(body: AuthRegisterAdminDto): Promise<AuthLogin> {
        try {
            const newAdmin = await this.adminService.create(body);
            newAdmin.password = undefined;
            return {
                message: 'Register success',
                data: {
                    token: await this.signToken(newAdmin._id, newAdmin.email, true, 'admin'),
                    user: newAdmin,
                },
            };
        } catch (error) {
            throw error;
        }
    }
    async adminLogin(body: AuthLoginAdminDto): Promise<AuthLogin> {
        try {
            const { username, password } = body;
            const admin = await this.adminService.findByUsernameWithValidate(username);
            if (!(await admin.comparePassword(password))) throw new BadRequestException('Password invalid');
            admin.password = undefined;
            return {
                message: 'Login success',
                data: {
                    token: await this.signToken(admin._id, admin.email, true, 'admin'),
                    user: admin,
                },
            };
        } catch (error) {
            throw error;
        }
    }
}
