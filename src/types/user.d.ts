import { GenderDocument } from 'src/schemas/gender.schema';

declare interface INameUser {
    firstName: string;
    lastName: string;
}

declare interface IImage {
    url: string;
    isDefault: boolean;
    isFavorite: boolean;
}

declare interface IStrangeUserAround {
    _id: string;
    name: {
        firstName: string;
        lastName: string;
    };
    age: number;
    avatar: string;
    gender: string | GenderDocument;
    lastLocation: {
        latitude: number;
        longitude: number;
    };
    distance: number;
    info: {
        height: number;
        reason: string;
        beer: string | BeerDocument;
        religion: boolean;
        education: string | EducationDocument;
    };
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
    hobbies: string[] | HobbyDocument[];
}
