import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { TransactionDocument } from './transaction.schema';
import 'dotenv/config';
import { AutoMap } from '@automapper/classes';
import { HobbyDocument } from './hobby.schema';
import { BeerDocument } from './beer.schema';
import { EducationDocument } from './education.schema';
import { GenderDocument } from './gender.schema';
import 'dotenv/config';
export type UserDocument = User & Document;

@Schema({
    timestamps: true,
})
export class User {
    @AutoMap()
    _id: string;

    @AutoMap()
    @Prop({
        type: String,
        unique: true,
        sparse: true,
    })
    phone: string;

    @AutoMap()
    @Prop({
        type: String,
        unique: true,
        sparse: true,
    })
    email: string;

    @AutoMap()
    @Prop({
        type: {
            firstName: String,
            lastName: String,
        },
    })
    name: {
        firstName: string;
        lastName: string;
    };

    @AutoMap()
    @Prop({
        type: String,
        unique: true,
        sparse: true,
    })
    nickname: string;

    @AutoMap()
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gender',
    })
    gender: GenderDocument | string;

    @AutoMap()
    @Prop({
        type: mongoose.Schema.Types.Date,
    })
    birthday: string;

    @AutoMap()
    @Prop({
        type: {
            isFirstUpdate: Boolean,
            isVerified: Boolean,
            isActive: Boolean,
        },
        default: {
            isFirstUpdate: true,
            isVerified: false,
            isActive: true,
        },
    })
    status: {
        isFirstUpdate: boolean;
        isVerified: boolean;
        isActive: boolean;
    };

    @AutoMap()
    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }])
    friends: UserDocument[] | string[];

    @AutoMap()
    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }])
    block: UserDocument[] | string[];

    @AutoMap()
    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }])
    blocked: UserDocument[] | string[];

    @AutoMap()
    @Prop({
        type: Number,
        default: 0,
    })
    walletAmount: number;

    @AutoMap()
    @Prop({
        type: String,
    })
    avatar: string;

    @AutoMap()
    @Prop({
        type: {
            bio: String,
            albums: [
                {
                    url: String,
                    isFavorite: Boolean,
                    isDefault: Boolean,
                },
            ],
        },
        default: {
            bio: '',
            albums: [],
        },
    })
    profile: {
        bio: string;
        albums: [
            {
                url: string;
                isFavorite: boolean;
                isDefault: boolean;
            },
        ];
    };

    @AutoMap()
    @Prop({
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
    })
    transactions: TransactionDocument[] | string[];

    @AutoMap()
    @Prop([
        {
            giftId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Gift',
            },
            quantity: Number,
        },
    ])
    bag: [
        {
            giftId: string;
            quantity: number;
        },
    ];

    @AutoMap()
    @Prop({
        type: {
            latitude: Number,
            longitude: Number,
            updatedAt: mongoose.Schema.Types.Date,
        },
    })
    lastLocation: {
        latitude: number;
        longitude: number;
        updatedAt: Date;
    };

    @AutoMap()
    @Prop({
        type: mongoose.Schema.Types.Date,
        default: Date.now(),
    })
    lastLogin: Date;

    @AutoMap()
    @Prop({
        type: {
            expire: mongoose.Schema.Types.Date,
            times: Number,
        },
        default: {
            expire: new Date(Date.now() + 15 * 60 * 1000),
            times: 4,
        },
    })
    otp: {
        expire: Date;
        times: number;
    };

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Hobby' }])
    hobbies: HobbyDocument[] | string[];

    @Prop({
        type: {
            height: Number,
            reason: String,
            beer: { type: mongoose.Schema.Types.ObjectId, ref: 'Beer' },
            religion: Boolean,
            education: { type: mongoose.Schema.Types.ObjectId, ref: 'Education' },
        },
        default: {
            religion: false,
        },
    })
    info: {
        height: number;
        reason: string;
        beer: BeerDocument | string;
        religion: boolean;
        education: EducationDocument | string;
    };
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
    const user = this as UserDocument;
    if (user.isNew && user.email) {
        user.nickname = user.email.split('@')[0];
    }
    if (user.otp.times === 0 && user.status.isActive) {
        user.status.isActive = false;
    }
    next();
});
