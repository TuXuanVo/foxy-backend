import { IsMongoId, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class GetConversationByIdDto {
    @IsMongoId()
    @IsNotEmpty()
    id: string;
    @IsNumber()
    @IsOptional()
    @IsNotEmpty()
    limit: number;
    @IsNumber()
    @IsOptional()
    @IsNotEmpty()
    page: number;
}
