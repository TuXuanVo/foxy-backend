import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type SystemDocument = System & Document;
@Schema({
    timestamps: true,
})
export class System {
    @Prop({
        type: String,
        unique: true,
        required: true,
    })
    name: string;

    @Prop({
        type: mongoose.Schema.Types.Mixed,
        required: true,
    })
    value: string | number | boolean;
}

export const SystemSchema = SchemaFactory.createForClass(System);
