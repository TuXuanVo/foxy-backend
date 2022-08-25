import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CoinPackageCreateDto {
    @ApiProperty({
        type: String,
        default: '4822',
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        type: Number,
        default: 100,
    })
    @IsNumber()
    @IsNotEmpty()
    coin: number;
}
export class CoinPackageUpdateDto extends PickType(CoinPackageCreateDto, ['name', 'coin']) {
    @IsOptional()
    name: string;

    @IsOptional()
    coin: number;
}
