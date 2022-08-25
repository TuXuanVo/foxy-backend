import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type GenderDocument = Gender & Document;
@Schema({
    timestamps: true,
})
export class Gender {
    @AutoMap()
    _id: string;

    @AutoMap()
    @Prop({
        type: String,
        unique: true,
        required: true,
    })
    name: string;
}

export const GenderSchema = SchemaFactory.createForClass(Gender);
