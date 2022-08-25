import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateBeerDto {
    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    name: string;
}

export class DeleteBeerDto {
    @ApiProperty({ type: String })
    @IsMongoId()
    @IsNotEmpty()
    id: string;
}

export class UpdateBeerDto {
    @ApiProperty({ type: String })
    @IsMongoId()
    @IsNotEmpty()
    id: string;

    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    name: string;
}
