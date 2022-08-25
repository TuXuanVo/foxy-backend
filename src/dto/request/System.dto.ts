import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsNumberOrStringOrBoolean } from 'src/utils/customValidation';

export class SettingDto {
    @ApiProperty({ type: String, default: 'COIN_EXCHANGE_RATE' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        oneOf: [{ type: 'Number' }, { type: 'String' }, { type: 'Boolean' }],
        default: 0.8,
    })
    @IsNotEmpty()
    @Validate(IsNumberOrStringOrBoolean, {
        message: 'Value must be number or string or boolean',
    })
    value: number | string | boolean;
}

export class UpdateSettingDto {
    @ApiProperty({
        oneOf: [{ type: 'Number' }, { type: 'String' }, { type: 'Boolean' }],
        default: 0.8,
    })
    @IsNotEmpty()
    @Validate(IsNumberOrStringOrBoolean, {
        message: 'Value must be number or string or boolean',
    })
    value: number | string | boolean;
}
