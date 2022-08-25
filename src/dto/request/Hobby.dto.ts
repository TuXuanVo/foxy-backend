import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsMongoId, IsNotEmpty } from 'class-validator';

export class HobbyDto {
    @ApiProperty({ type: [String] })
    @IsMongoId({ each: true })
    @IsNotEmpty()
    @IsArray()
    hobbies: string[];
}
export class CreateHobbyDto {
    @ApiProperty({ type: String })
    @IsString()
    @IsNotEmpty()
    name: string;
}

export class UpdateHobbyDto extends CreateHobbyDto {}
