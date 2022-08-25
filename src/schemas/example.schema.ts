import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type NameDocument = Name & Document;
@Schema({
    timestamps: true,
})
export class Name {}

export const NameSchema = SchemaFactory.createForClass(Name);
