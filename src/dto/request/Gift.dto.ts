import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class GiftDto {
    @ApiProperty({ type: String, default: 'Bunch of roses' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ type: Number, default: 1000 })
    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    value: number;

    @ApiProperty({ type: String, default: 'www.image-url.com' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @IsUrl()
    image: string;
}

export class BuyGiftDto {
    @ApiProperty({ type: String })
    // @IsMongoId()
    @IsString()
    @IsNotEmpty()
    giftId: string;

    @ApiProperty({ type: Number, default: 5 })
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    quantity: number;
}

export class SendGiftDto {
    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    receiveId: string;

    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    giftId: string;
}

export class ExchangeGiftDto {
    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    giftId: string;

    @ApiProperty({ type: Number })
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    quantity: number;
}
