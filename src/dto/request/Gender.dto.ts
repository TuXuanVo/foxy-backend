import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateGenderDto {
    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    name: string;
}

export class DeleteGenderDto {
    @ApiProperty({ type: String })
    @IsMongoId()
    @IsNotEmpty()
    id: string;
}

export class UpdateGenderDto {
    @ApiProperty({ type: String })
    @IsMongoId()
    @IsNotEmpty()
    id: string;

    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    name: string;
}
