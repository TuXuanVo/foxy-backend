import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEmail, IsMongoId, IsOptional, IsString, Length } from 'class-validator';

import { AuthRegisterAdminDto } from './Auth.dto';

export class UpdateAdminDto extends PickType(AuthRegisterAdminDto, ['password']) {
    @ApiProperty({
        default: 'qwertyuiop',
    })
    @IsOptional()
    @Length(8, 30, { message: 'Name must be at least 8 characters long' })
    @IsString({
        message: 'Name must be a string',
    })
    name: string;

    @ApiProperty({
        default: '123456789@Aa',
    })
    @IsOptional()
    password: string;

    @ApiProperty({
        default: 'foxy@gmail.com',
    })
    @IsOptional()
    @IsEmail({}, { message: 'Email is not valid' })
    email: string;

    @ApiProperty({ type: String })
    @IsMongoId()
    @IsOptional()
    gender: string;
}
