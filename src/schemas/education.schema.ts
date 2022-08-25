import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type EducationDocument = Education & Document;
@Schema({
    timestamps: true,
})
export class Education {
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

export const EducationSchema = SchemaFactory.createForClass(Education);
