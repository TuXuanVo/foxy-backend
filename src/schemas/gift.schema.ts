import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type GiftDocument = Gift & Document;
@Schema({
    timestamps: true,
})
export class Gift {
    @Prop({
        required: true,
        type: String,
    })
    name: string;

    @Prop({
        required: true,
        type: Number,
    })
    price: number;

    @Prop({
        required: true,
        type: String,
    })
    image: string;
}

export const GiftSchema = SchemaFactory.createForClass(Gift);
