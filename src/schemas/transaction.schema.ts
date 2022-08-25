import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UserDocument } from './user.schema';

export type TransactionDocument = Transaction & Document;
export enum TransactionType {
    IN = 'in',
    OUT = 'out',
}

@Schema({
    timestamps: true,
})
export class Transaction {
    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    })
    user: UserDocument | string;

    @Prop({
        required: true,
        type: Number,
    })
    value: number;

    @Prop({
        required: true,
        type: String,
        enum: TransactionType,
    })
    type: TransactionType;

    @Prop({
        required: true,
        type: String,
    })
    message: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
