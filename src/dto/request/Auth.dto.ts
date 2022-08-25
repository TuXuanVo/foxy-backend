import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString, Length, Matches } from 'class-validator';
import { Match } from 'src/schemas/match.schema';

export class AuthLoginSocialDto {
    @ApiProperty({
        default: 'qwertyuiop@gmail.com',
    })
    @IsEmail({}, { message: 'Email is not valid' })
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        default: 'AAA',
    })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({
        default: 'BBB',
    })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({
        default: 'https://docs.nestjs.com/assets/logo-small.svg',
    })
    @IsString()
    @IsNotEmpty()
    avatar: string;
}

export class AuthSendOTPDto {
    @ApiProperty({
        default: '0321456789',
    })
    @IsString()
    @Matches(/(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/)
    @IsNotEmpty()
    phone: string;

    @ApiProperty({ type: String })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class AuthOTPDto {
    @ApiProperty({
        default: '123456',
    })
    @Length(6, 6, {
        message: 'The OTP is not valid',
    })
    @IsNumberString({
        message: 'The OTP is not valid',
    })
    otp: string;

    @ApiProperty({ type: String })
    @IsOptional()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ type: String })
    @IsOptional()
    @IsNumberString()
    @IsNotEmpty()
    phone: string;
}
export class AuthRegisterAdminDto {
    @ApiProperty({
        default: 'qwertyuiop@gmail.com',
    })
    @IsEmail(
        {},
        {
            message: 'Email is not valid',
        },
    )
    email: string;

    @ApiProperty({
        default: 'admin1234',
    })
    @IsString()
    @IsNotEmpty()
    @Length(8, 20, {
        message: 'Username must be at least 8 characters long',
    })
    username: string;

    @ApiProperty({
        default: '123456789@Aa',
    })
    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[0-9a-zA-Z!@#$%^&*]{8,}$/, {
        message:
            'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number',
    })
    password: string;
}
export class AuthLoginAdminDto extends PickType(AuthRegisterAdminDto, ['username', 'password']) {}

export class AuthPhoneDto {
    @ApiProperty({
        default: '0321456789',
    })
    @IsNumberString()
    @IsNotEmpty()
    @Matches(/(0[3|5|7|8|9])+([0-9]{8})\b/g, {
        message: 'Phone is not valid',
    })
    phone: string;
}
