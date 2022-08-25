import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserDocument } from './user.schema';
import { MessageDocument } from './message.schema';
import mongoose, { ObjectId } from 'mongoose';

export type ConversationDocument = Conversation & Document;
@Schema({
    timestamps: true,
})
export class Conversation {
    _id: ObjectId;
    @Prop([
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ])
    users: UserDocument[] | string[];

    @Prop([
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
        },
    ])
    messages: MessageDocument[] | string[];

    @Prop({
        name: String,
        value: mongoose.Schema.Types.Mixed,
    })
    settings: [
        {
            name: string;
            value: string | number | boolean;
        },
    ];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
