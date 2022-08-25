import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { comparePassword, hashPassword } from 'src/utils/bcrypr';
import { GenderDocument } from './gender.schema';

export type AdminDocument = Admin & Document;
@Schema({
    timestamps: true,
})
export class Admin {
    _id: string;
    @Prop({
        type: String,
        required: true,
        unique: true,
    })
    username: string;
    @Prop({
        type: String,
        required: true,
    })
    password: string;

    @Prop({
        type: String,
    })
    name: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Gender' })
    gender: GenderDocument | string;

    @Prop({
        type: String,
        required: true,
        unique: true,
    })
    email: string;

    comparePassword: (password: string) => Promise<boolean>;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

AdminSchema.methods.comparePassword = async function (password: string) {
    return await comparePassword(password, this.password);
};

AdminSchema.pre('findOneAndUpdate', async function (next) {
    try {
        this.getUpdate();
        const raw: any = this.getUpdate();
        //hash this password
        if (raw.password) {
            raw.password = await hashPassword(raw.password);
        }
        next();
    } catch (error) {
        next(error);
    }
});

AdminSchema.pre('save', async function (next) {
    const user = this as any;
    try {
        if (user.isModified('password') || user.isNew) {
            user.password = await hashPassword(user.password);
        }
        next();
    } catch (error) {
        next(error);
    }
});
