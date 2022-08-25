import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CoinpackageDocument = CoinPackage & Document;
@Schema({
    timestamps: true,
})
export class CoinPackage {
    @Prop({
        required: true,
        type: String,
        unique: true,
    })
    name: string;

    @Prop({
        required: true,
        type: Number,
    })
    coin: number;
}
export const CoinPackageSchema = SchemaFactory.createForClass(CoinPackage);
