import { HttpStatus, Injectable } from '@nestjs/common';
import {
    ERROR_FIND_FRIENDS_AROUND,
    ERROR_GET_USERS,
    ERROR_UPDATE_LOCATION,
    GET_FRIENDS_AROUND_SUCCESSFULLY,
    UPDATE_LOCATION_SUCCESSFULLY,
    USER_NOT_FOUND,
} from 'src/constance/responseCode';
import { handleResponse } from 'src/dto/response/Response.dto';
import { IStrangeUserAround } from 'src/types/user';
import { UserService } from 'src/user/user.service';
import { currentAge } from 'src/utils';

@Injectable()
export class MapService {
    constructor(private readonly userService: UserService) {}

    async updateLocation(userId: string, location: ILocation) {
        try {
            const user = await this.userService.updateLocation(userId, location);
            return handleResponse({
                message: UPDATE_LOCATION_SUCCESSFULLY,
                data: { ...user.lastLocation },
            });
            // return await this.userService.updateLocation(userId, location);
        } catch (error) {
            return handleResponse({
                error: ERROR_UPDATE_LOCATION,
                statusCode: HttpStatus.BAD_REQUEST,
            });
        }
    }

    async findFriendAround(userId: string) {
        try {
            //Get radius from Setting collections
            const radius = 200; // metersb

            const me = await this.userService.findById(userId);
            if (!me)
                return handleResponse({
                    error: USER_NOT_FOUND,
                    statusCode: HttpStatus.BAD_REQUEST,
                });

            const users = await this.userService.getOtherUserToday(userId);
            if (!users)
                return handleResponse({
                    error: ERROR_GET_USERS,
                    statusCode: HttpStatus.BAD_REQUEST,
                });

            const friendsAround: IStrangeUserAround[] = [];
            users.forEach((user) => {
                if (user.lastLocation.latitude && user.lastLocation.longitude) {
                    const distance = this.getDistance(me.lastLocation, user.lastLocation);
                    if (this.getDistance(me.lastLocation, user.lastLocation) <= radius) {
                        friendsAround.push({
                            _id: user._id,
                            name: user.name,
                            avatar: user.avatar,
                            age: currentAge(user.birthday),
                            lastLocation: user.lastLocation,
                            distance: Math.floor(distance),
                            gender: user.gender,
                            info: user.info,
                            hobbies: user.hobbies,
                            profile: user.profile,
                        });
                    }
                }
            });
            return handleResponse({
                message: GET_FRIENDS_AROUND_SUCCESSFULLY,
                data: friendsAround,
            });
        } catch (error) {
            return handleResponse({
                error: error.response?.error || ERROR_FIND_FRIENDS_AROUND,
                statusCode: error.response?.statusCode || HttpStatus.BAD_REQUEST,
            });
        }
    }

    getDistance(locationA: ILocation, locationB: ILocation) {
        const R = 6378137;
        const rlat1 = locationA.latitude * (Math.PI / 180);
        const rlat2 = locationB.latitude * (Math.PI / 180);
        const difflat = rlat2 - rlat1; // Radian difference (latitudes)
        const difflon = (locationB.longitude - locationA.longitude) * (Math.PI / 180);

        const distance =
            2 *
            R *
            Math.asin(
                Math.sqrt(
                    Math.sin(difflat / 2) * Math.sin(difflat / 2) +
                        Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2),
                ),
            );
        return distance;
    }
}
