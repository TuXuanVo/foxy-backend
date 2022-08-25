import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserDocument } from './user.schema';
import mongoose from 'mongoose';

export type MatchDocument = Match & Document;
@Schema({
    timestamps: true,
})
export class Match {
    _id: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    })
    fromId: UserDocument | string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    })
    toId: UserDocument | string;
}

export const MatchSchema = SchemaFactory.createForClass(Match);
