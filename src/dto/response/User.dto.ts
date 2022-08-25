import { AutoMap } from '@automapper/classes';

export class CommonInfoResponseDto {
    @AutoMap()
    name: {
        firstName: string;
        lastName: string;
    };

    @AutoMap()
    avatar: string;

    @AutoMap()
    birthday: string;
}
