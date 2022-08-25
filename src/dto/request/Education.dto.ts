import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateEducationDto {
    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    name: string;
}

export class DeleteEducationDto {
    @ApiProperty({ type: String })
    @IsMongoId()
    @IsNotEmpty()
    id: string;
}

export class UpdateEducationDto {
    @ApiProperty({ type: String })
    @IsMongoId()
    @IsNotEmpty()
    id: string;

    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    name: string;
}
