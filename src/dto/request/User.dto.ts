import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsDateString,
    IsDefined,
    IsEmail,
    IsMongoId,
    IsNotEmpty,
    IsNotEmptyObject,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    Length,
    Matches,
    ValidateNested,
} from 'class-validator';

export class UserCreateDto {
    @ApiProperty({ type: String })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ type: String, default: 'Nguyễn Văn' })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ type: String, default: 'An' })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({ type: String, default: 'www.user-avatar.com' })
    @IsString()
    @IsNotEmpty()
    avatar: string;
}

export class UserCreateWithPhoneDto {
    @ApiProperty({ type: String, default: '0987654321' })
    @IsString()
    @IsNotEmpty()
    phone: string;
}

export class LikeUserDto {
    @ApiProperty({ type: String })
    @IsMongoId()
    @IsNotEmpty()
    userId: string;
}

export class UserNameDto {
    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    @Length(2, 20)
    first_name: string;

    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    @Length(2, 20)
    last_name: string;
}

export class UserProfileDto {
    @IsOptional()
    @Length(0, 200)
    @IsString()
    @IsNotEmpty()
    bio: string;

    @IsOptional()
    @IsArray()
    @IsNotEmpty()
    @IsString({ each: true })
    @IsNotEmptyObject()
    album: string[];
}

export class UserUpdateDto {
    @IsOptional()
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => UserNameDto)
    @ApiProperty({
        type: String,
        default: {
            first_name: 'Nguyễn Văn',
            last_name: 'An',
        },
    })
    name: UserNameDto;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Matches(/^[A-Za-z0-9]+([A-Za-z0-9]*|[._-]?[A-Za-z0-9]+)*$/g)
    @ApiProperty({ type: String, default: 'nguyenvana123' })
    nickname: string;

    @ApiProperty({ type: String })
    @IsMongoId()
    @IsOptional()
    gender: string;

    @ApiProperty({ type: Date, default: '' })
    @IsOptional()
    @IsNotEmpty()
    @IsDateString()
    birthday: Date;

    @ApiProperty({ type: String, default: '' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    avatar: string;

    @ApiProperty({
        type: UserProfileDto,
        default: {
            bio: '',
            album: [],
        },
    })
    @IsOptional()
    @IsObject()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => UserProfileDto)
    profile: UserProfileDto;
}

export class UserFirstUpdateDto {
    @ApiProperty({ type: String, default: 'Nguyen Van A' })
    @IsString()
    @IsNotEmpty()
    @Length(6, 30)
    name: string;

    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    email: string;

    @ApiProperty({ type: Date, default: '2001-01-01' })
    @IsNotEmpty()
    @IsDateString()
    birthday: Date;

    @ApiProperty({ type: String })
    @IsMongoId()
    gender: string;
}

export class IdDto {
    @ApiProperty({ type: String })
    @IsMongoId()
    @IsNotEmpty()
    id: string;
}

export class ReligionDto {
    @ApiProperty({ type: Boolean })
    @IsBoolean()
    @IsNotEmpty()
    religion: boolean;
}

export class BioDto {
    @ApiProperty({ type: String })
    @Length(0, 200)
    @IsString()
    @IsNotEmpty()
    bio: string;
}

export class ReasonDto {
    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    reason: string;
}

export class CommonInfoDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    @IsNotEmpty()
    birthday: Date;
}

export class ImageDto {
    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    url: string;
}

export class HeightDto {
    @ApiProperty({ type: Number })
    @IsNumber()
    @IsNotEmpty()
    height: number;
}
