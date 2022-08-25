import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type BeerDocument = Beer & Document;
@Schema({
    timestamps: true,
})
export class Beer {
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

export const BeerSchema = SchemaFactory.createForClass(Beer);
