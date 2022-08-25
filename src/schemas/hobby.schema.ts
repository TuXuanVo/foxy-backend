import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type HobbyDocument = Hobby & Document;
@Schema({
    timestamps: true,
})
export class Hobby {
    @Prop({
        type: String,
        unique: true,
        required: true,
    })
    name: string;
}

export const HobbySchema = SchemaFactory.createForClass(Hobby);
