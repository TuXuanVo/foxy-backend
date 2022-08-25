import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { FirstUpdateDto, InfoDto, UserDto } from 'src/dto/response/Auth.dto';
import { Gender } from 'src/schemas/gender.schema';
import { Beer } from 'src/schemas/beer.schema';
import { Education } from 'src/schemas/education.schema';
import { CommonInfoResponseDto } from 'src/dto/response/User.dto';

@Injectable()
export class AuthProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper: Mapper) => {
            createMap(
                mapper,
                User,
                UserDto,
                forMember(
                    (destination) => destination._id,
                    mapFrom((source) => source._id),
                ),
                forMember(
                    (destination) => destination.name,
                    mapFrom((source) => source.name),
                ),
                forMember(
                    (destination) => destination.status,
                    mapFrom((source) => source.status),
                ),
                forMember(
                    (destination) => destination.friends,
                    mapFrom((source) => source.friends),
                ),
                forMember(
                    (destination) => destination.block,
                    mapFrom((source) => source.block),
                ),
                forMember(
                    (destination) => destination.transactions,
                    mapFrom((source) => source.transactions),
                ),
                forMember(
                    (destination) => destination.bag,
                    mapFrom((source) => source.bag),
                ),
                forMember(
                    (destination) => destination.lastLocation,
                    mapFrom((source) => source.lastLocation),
                ),
                forMember(
                    (destination) => destination.hobbies,
                    mapFrom((source) => source.hobbies),
                ),
                forMember(
                    (destination) => destination.gender,
                    mapFrom((source) => source.gender),
                ),
                forMember(
                    (destination) => destination.info,
                    mapFrom((source) => source.info),
                ),
                forMember(
                    (destination) => destination.profile,
                    mapFrom((source) => source.profile),
                ),
            );
            createMap(
                mapper,
                Gender,
                InfoDto,
                forMember(
                    (destination) => destination._id,
                    mapFrom((source) => source._id),
                ),
            );
            createMap(
                mapper,
                Beer,
                InfoDto,
                forMember(
                    (destination) => destination._id,
                    mapFrom((source) => source._id),
                ),
            );
            createMap(
                mapper,
                Education,
                InfoDto,
                forMember(
                    (destination) => destination._id,
                    mapFrom((source) => source._id),
                ),
            );
            createMap(
                mapper,
                User,
                FirstUpdateDto,
                forMember(
                    (destination) => destination.name,
                    mapFrom((source) => source.name),
                ),
                forMember(
                    (destination) => destination.gender,
                    mapFrom((source) => source.gender),
                ),
            );
            createMap(
                mapper,
                User,
                CommonInfoResponseDto,
                forMember(
                    (destination) => destination.name,
                    mapFrom((source) => source.name),
                ),
            );
        };
    }
}
