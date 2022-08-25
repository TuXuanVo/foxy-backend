import { AutoMap } from '@automapper/classes';
import { Admin } from 'src/schemas/admin.schema';
import { BeerDocument } from 'src/schemas/beer.schema';
import { EducationDocument } from 'src/schemas/education.schema';
import { GenderDocument } from 'src/schemas/gender.schema';
import { HobbyDocument } from 'src/schemas/hobby.schema';
import { TransactionDocument } from 'src/schemas/transaction.schema';
import { User, UserDocument } from 'src/schemas/user.schema';

export interface AuthLogin {
    message: string;
    data?: {
        token: string;
        user?: User | Admin;
    };
}

export interface AuthHandleName {
    firstName: string;
    lastName: string;
}

export class UserDto {
    @AutoMap()
    _id: string;

    @AutoMap()
    phone: string;

    @AutoMap()
    email: string;

    @AutoMap()
    name: {
        firstName: string;
        lastName: string;
    };

    @AutoMap()
    nickname: string;

    @AutoMap()
    gender: GenderDocument;

    @AutoMap()
    birthday: string;

    @AutoMap()
    status: {
        isFirstUpdate: boolean;
        isVerified: boolean;
        isActive: boolean;
    };

    @AutoMap()
    walletAmount: number;

    @AutoMap()
    avatar: string;

    @AutoMap()
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
    bag: [
        {
            giftId: string;
            quantity: number;
        },
    ];

    @AutoMap()
    lastLocation: {
        latitude: number;
        longitude: number;
        updatedAt: Date;
    };

    @AutoMap()
    friends: UserDocument[];

    @AutoMap({})
    block: UserDocument[];

    @AutoMap()
    transactions: TransactionDocument[];

    @AutoMap()
    hobbies: HobbyDocument[];

    @AutoMap()
    info: {
        height: number;
        reason: string;
        beer: BeerDocument;
        religion: boolean;
        education: EducationDocument;
    };
}

export class InfoDto {
    @AutoMap()
    _id: string;

    @AutoMap()
    name: string;
}

export class FirstUpdateDto {
    @AutoMap()
    name: {
        firstName: string;
        lastName: string;
    };

    @AutoMap()
    email: string;

    @AutoMap()
    birthday: string;

    @AutoMap()
    gender: GenderDocument;
}
