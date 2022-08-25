import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class LocationDto {
    @ApiProperty({ type: Number, default: 10.843490599727359 })
    @IsNumber()
    @IsNotEmpty()
    latitude: number;

    @ApiProperty({ type: Number, default: 106.71233969296027 })
    @IsNumber()
    @IsNotEmpty()
    longitude: number;
}
