import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UserDocument } from './user.schema';

export type NotificationDocument = Notification & Document;
export enum NotificationType {
    LIKE = 'like',
    MESSAGE = 'message',
    MATCH = 'match',
    GIFT = 'gift',
}
@Schema({
    timestamps: true,
})
export class Notification {
    @Prop({
        type: String,
        enum: NotificationType,
        required: true,
    })
    type: NotificationType;

    @Prop({
        type: String,
    })
    message: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    })
    user: UserDocument | string;

    @Prop({
        type: Boolean,
        default: false,
    })
    hasSeen: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
