import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Document, Model } from 'mongoose';
import {
    BLOCK_USER_SUCCESSFULLY,
    ERROR_ALREADY_BLOCK,
    ERROR_ALREADY_BLOCKED,
    ERROR_ALREADY_FRIEND,
    ERROR_BLOCK_USER,
    ADD_USER_HOBBIES_SUCCESSFULLY,
    BEER_NOT_FOUND,
    EDUCATION_NOT_FOUND,
    ERROR_ADD_USER_HOBBIES,
    ERROR_GET_USERS,
    ERROR_LIKE_USER,
    ERROR_LIKE_YOURSELF,
    ERROR_UNBLOCK_USER,
    ERROR_UPDATE_USER,
    GET_STRANGE_FRIEND_SUCCESSFULLY,
    LIKE_USER_SUCCESSFULLY,
    UNBLOCK_USER_SUCCESSFULLY,
    ERROR_UPDATE_USER_BEER,
    ERROR_UPDATE_USER_EDUCATION,
    ERROR_UPDATE_USER_GENDER,
    ERROR_UPDATE_USER_RELIGION,
    GENDER_NOT_FOUND,
    UPDATE_USER_BEER_SUCCESSFULLY,
    UPDATE_USER_EDUCATION_SUCCESSFULLY,
    UPDATE_USER_GENDER_SUCCESSFULLY,
    UPDATE_USER_RELIGION_SUCCESSFULLY,
    USER_NOT_FOUND,
    ERROR_DELETE_USER_HOBBY,
    DELETE_USER_HOBBY_SUCCESSFULLY,
    ALBUMS_IS_FULL,
    ERROR_UPDATE_USER_ALBUMS,
    EXCEED_ALBUMS_LENGTH,
    UPLOAD_ALBUMS_SUCCESSFULLY,
    UPDATE_USER_BIO_SUCCESSFULLY,
    ERROR_UPDATE_USER_BIO,
    ERROR_FIRST_UPDATE_USER,
    FIRST_UPDATE_USER_SUCCESSFULLY,
    ERROR_EMAIL_HAS_BEEN_USED,
    ERROR_NO_PERRISSION,
    ERROR_UPDATE_COMMON_INFO,
    UPDATE_USER_COMMON_INFO_SUCCESSFULLY,
    ERROR_UPDATE_USER_REASON,
    UPDATE_USER_REASON_SUCCESSFULLY,
    ERROR_UPDATE_USER_FARVORITE_IMAGE,
    UPDATE_USER_FARVORITE_IMAGE_SUCCESSFULLY,
    UPDATE_USER_DEFAULT_IMAGE_SUCCESSFULLY,
    ERROR_UPDATE_USER_DEFAULT_IMAGE,
    ERROR_DELETE_IMAGE_ALBUMS,
    DELETE_IMAGE_ALBUMS_SUCCESSFULLY,
    ERROR_UPDATE_USER_HEIGHT,
    UPDATE_USER_HEIGHT_SUCCESSFULLY,
} from 'src/constance/responseCode';
import { ConversationService } from 'src/conversation/conversation.service';
import { CommonInfoDto, UserCreateDto, UserCreateWithPhoneDto, UserFirstUpdateDto, UserUpdateDto } from 'src/dto';
import { handleResponse } from 'src/dto/response/Response.dto';
import { MatchService } from 'src/match/match.service';
import { NotificationService } from 'src/notification/notification.service';
import { User, UserDocument } from 'src/schemas/user.schema';
import { currentAge } from 'src/utils';
import { BeerService } from 'src/beer/beer.service';
import { EducationService } from 'src/education/education.service';
import { GenderService } from 'src/gender/gender.service';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { FirstUpdateDto, InfoDto, UserDto } from 'src/dto/response/Auth.dto';
import { Hobby } from 'src/schemas/hobby.schema';
import { Beer } from 'src/schemas/beer.schema';
import { Gender } from 'src/schemas/gender.schema';
import { Education } from 'src/schemas/education.schema';
import { HttpService } from '@nestjs/axios';
import { CommonInfoResponseDto } from 'src/dto/response/User.dto';
import { INameUser, IStrangeUserAround } from 'src/types/user';

@Injectable()
export class UserService {
    constructor(
        @InjectMapper() private readonly mapper: Mapper,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private matchService: MatchService,
        private notificationService: NotificationService,
        private conversationService: ConversationService,
        private beerService: BeerService,
        private educationService: EducationService,
        private genderService: GenderService,
        private readonly httpService: HttpService,
    ) {}
    async create(body: UserCreateDto): Promise<User> {
        return this.userModel.create({
            email: body.email,
            name: {
                firstName: body.firstName,
                lastName: body.lastName,
            },
            avatar: body.avatar,
        });
    }
    async findById(id: string): Promise<UserDocument> {
        return this.userModel.findById(id);
    }
    async findByIdWithValidate(id: string): Promise<UserDocument> {
        const result = this.userModel.findById(id);
        if (!result) throw new NotFoundException(USER_NOT_FOUND);
        return result;
    }
    async findByEmail(email: string): Promise<UserDocument> {
        return this.userModel.findOne({ email });
    }
    async updateOTPByEmail(email: string): Promise<UserDocument> {
        return this.userModel.findOneAndUpdate(
            { email },
            {
                otp: {
                    times: 4,
                    expire: new Date(Date.now() + 10 * 60 * 1000),
                },
            },
        );
    }

    async updateOTPByPhone(phone: string): Promise<UserDocument> {
        return this.userModel.findOneAndUpdate(
            { phone },
            {
                otp: {
                    times: 4,
                    expire: new Date(Date.now() + 10 * 60 * 1000),
                },
            },
        );
    }

    async updateOTPAndPhone(email: string, phone: string): Promise<UserDocument> {
        return this.userModel.findOneAndUpdate(
            { email },
            {
                phone,
                otp: {
                    times: 4,
                    expire: new Date(Date.now() + 10 * 60 * 1000),
                },
            },
        );
    }
    async like(fromUser: string, toUser: string) {
        try {
            //* if fromUser like itself, throw error
            if (fromUser === toUser)
                return handleResponse({
                    error: ERROR_LIKE_YOURSELF,
                    statusCode: HttpStatus.BAD_REQUEST,
                });
            const matchId = await this.matchService.isAMatchB(toUser, fromUser);
            const currentUser = await this.userModel.findById(fromUser);
            //*if fromUser was blocked by toUser
            const wasBlocked = currentUser.blocked.includes(toUser as string & User & Document<any, any, any>);
            if (wasBlocked) {
                return handleResponse({
                    error: ERROR_ALREADY_BLOCKED,
                    statusCode: HttpStatus.BAD_REQUEST,
                });
            }
            //*if fromUser block toUser
            const isBlocked = currentUser.blocked.includes(toUser as string & User & Document<any, any, any>);
            if (isBlocked) {
                return handleResponse({
                    error: ERROR_ALREADY_BLOCK,
                    statusCode: HttpStatus.BAD_REQUEST,
                });
            }
            const isFriend = currentUser.friends.includes(toUser as string & User & Document<any, any, any>);
            //* if user is already a friend, then return error
            if (isFriend)
                return handleResponse({
                    error: ERROR_ALREADY_FRIEND,
                    statusCode: HttpStatus.BAD_REQUEST,
                });
            //*if 2 user like each other, then both user are friends
            if (matchId) {
                await this.matchService.delete(matchId);
                const userA = await this.userModel.findByIdAndUpdate(fromUser, {
                    $push: {
                        friends: new mongoose.Types.ObjectId(toUser) + '',
                    },
                });
                const userB = await this.userModel.findByIdAndUpdate(toUser, {
                    $push: {
                        friends: new mongoose.Types.ObjectId(fromUser) + '',
                    },
                });

                await this.conversationService.createConversation(userA._id, userB._id);

                await this.notificationService.match(userA, userB);
            } else {
                await this.notificationService.like(toUser);

                await this.matchService.create(fromUser, toUser);
            }
            return handleResponse({
                message: LIKE_USER_SUCCESSFULLY,
                data: {
                    user: toUser,
                },
            });
        } catch (error) {
            return handleResponse({
                error: error.response?.error || ERROR_LIKE_USER,
                statusCode: error.response?.statusCode || HttpStatus.BAD_REQUEST,
            });
        }
    }
    async unlike(fromUser: string, toUser: string) {
        try {
            const matchId = await this.matchService.isAMatchB(fromUser, toUser);
            if (matchId) {
                await this.matchService.delete(matchId);
            } else {
                const userA = await this.userModel.findByIdAndUpdate(fromUser, {
                    $pull: {
                        friends: new mongoose.Types.ObjectId(toUser) + '',
                    },
                });
                const userB = await this.userModel.findByIdAndUpdate(toUser, {
                    $pull: {
                        friends: new mongoose.Types.ObjectId(fromUser) + '',
                    },
                });
                await this.conversationService.delete(userA._id, userB._id);
            }
            return {
                message: 'You have unliked this user',
                data: {
                    user: toUser,
                },
            };
        } catch (error) {
            throw error;
        }
    }
    async block(userId: string, toUser: string) {
        try {
            const user = await this.findByIdWithValidate(userId);
            const toUserData = await this.findByIdWithValidate(toUser);
            if (user.block.includes(toUser as string & User & Document<any, any, any>)) {
                return handleResponse({
                    error: ERROR_ALREADY_BLOCKED,
                    statusCode: HttpStatus.BAD_REQUEST,
                });
            }
            user.block.push(toUser as string & User & Document<any, any, any>);
            toUserData.blocked.push(userId as string & User & Document<any, any, any>);
            await toUserData.save();
            await user.save();
            await this.conversationService.delete(user._id, toUser);
            await this.unlike(userId, toUser);
            return handleResponse({
                message: BLOCK_USER_SUCCESSFULLY,
                data: {
                    user: toUser,
                },
            });
        } catch (error) {
            return handleResponse({
                error: error.response?.error || ERROR_BLOCK_USER,
                statusCode: error.response?.statusCode || HttpStatus.BAD_REQUEST,
            });
        }
    }
    async unblock(userId: string, blockedUserId: string) {
        try {
            const user = await this.userModel.findOneAndUpdate(
                { _id: userId, block: { $in: [blockedUserId] } },
                {
                    $pull: {
                        block: blockedUserId,
                    },
                },
                { new: true },
            );
            const blockedUser = await this.userModel.findOneAndUpdate(
                { _id: blockedUserId, blocked: { $in: [userId] } },
                {
                    $pull: {
                        blocked: userId,
                    },
                },
                { new: true },
            );
            if (!user || !blockedUser)
                return handleResponse({
                    error: ERROR_UNBLOCK_USER,
                    statusCode: HttpStatus.BAD_REQUEST,
                });
            return handleResponse({
                message: UNBLOCK_USER_SUCCESSFULLY,
                data: {
                    user: user._id,
                },
            });
        } catch (error) {
            return handleResponse({
                error: error.response?.error || ERROR_UNBLOCK_USER,
                statusCode: error.response?.statusCode || HttpStatus.BAD_REQUEST,
            });
        }
    }

    async updateBagBuyGift(userId: string, bagItem: BagItem) {
        const user = await this.findByIdWithValidate(userId);
        const totalPrice: number = bagItem.price * bagItem.quantity;

        if (user.walletAmount >= totalPrice) {
            user.walletAmount -= totalPrice;

            let isExistItemBag = false;
            for (let i = 0; i < user.bag.length; i++) {
                if (user.bag[i].giftId.toString() === bagItem.giftId) {
                    user.bag[i].quantity += bagItem.quantity;
                    isExistItemBag = true;
                    break;
                }
            }

            if (!isExistItemBag) {
                user.bag.push({
                    giftId: bagItem.giftId,
                    quantity: bagItem.quantity,
                });
            }

            //TODO: create transaction

            return await user.save();
        }
        throw new BadRequestException('Not enough money');
    }
    async updateBagSendGift(sendId: string, receiveId: string, giftId: string) {
        const sendUser = await this.findByIdWithValidate(sendId);
        const receiveUser = await this.findByIdWithValidate(receiveId);

        let indexSendUserHasOneGift = -1;
        let isSendUserHasGift = false;
        let isReceiveUserHasGift = false;

        for (let i = 0; i < sendUser.bag.length; i++) {
            if (sendUser.bag[i].giftId.toString() === giftId) {
                if (sendUser.bag[i].quantity === 1) {
                    indexSendUserHasOneGift = i;
                }
                sendUser.bag[i].quantity -= 1;
                isSendUserHasGift = true;
                break;
            }
        }

        // if send user has one gift
        if (!indexSendUserHasOneGift) {
            sendUser.bag.splice(indexSendUserHasOneGift, 1);
        }

        // if receive user has gift
        if (!isSendUserHasGift) {
            throw new BadRequestException("User don't have this gift");
        }

        // if receive user has gift
        for (let i = 0; i < receiveUser.bag.length; i++) {
            if (receiveUser.bag[i].giftId.toString() === giftId) {
                receiveUser.bag[i].quantity += 1;
                isReceiveUserHasGift = true;
                break;
            }
        }

        //if receive users bag doesn't have this gift before then it will be pushed to receive user's bag
        if (!isReceiveUserHasGift) {
            receiveUser.bag.push({
                giftId: giftId,
                quantity: 1,
            });
        }

        await sendUser.save();
        await receiveUser.save();

        return {
            message: 'Send gift successfully',
            data: {
                giftId,
            },
        };
    }

    async updateLocation(userId: string, location: ILocation) {
        const updatedUser = await this.userModel
            .findOneAndUpdate(
                { _id: userId },
                {
                    $set: {
                        lastLocation: {
                            latitude: location.latitude,
                            longitude: location.longitude,
                            updatedAt: new Date(),
                        },
                    },
                },
                { new: true },
            )
            .lean();

        return updatedUser;
    }

    async getOtherUserToday(userId: string) {
        const beginOfToday = this.getBeginDate();

        const me = await this.findById(userId);

        const matchedId = (await this.matchService.getAllSendByUserId(userId)).map((match) => match.toId.toString());

        const friendsId: string[] = me.friends.map((friendId) => friendId.toString());

        const blocksId: string[] = me.block.map((blockId) => blockId.toString());

        const blockedId: string[] = me.blocked.map((blockedId) => blockedId.toString());

        const exceptIds = [...friendsId, ...blocksId, ...blockedId, ...matchedId, userId];

        return await this.userModel
            .find({
                _id: { $nin: exceptIds },
                'status.isActive': true,
                'lastLocation.updatedAt': { $gt: beginOfToday },
                'lastLocation.latitude': { $ne: undefined },
                'lastLocation.longitude': { $ne: undefined },
            })
            .populate([
                { path: 'hobbies', select: 'name' },
                { path: 'info.education', select: 'name' },
                { path: 'info.beer', select: 'name' },
                { path: 'gender', select: 'name' },
            ]);
    }

    async findByPhone(phone: string): Promise<UserDocument> {
        return this.userModel.findOne({ phone });
    }
    async createWithPhone(body: UserCreateWithPhoneDto): Promise<User> {
        return this.userModel.create({
            phone: body.phone,
            avatar: process.env.DEFAULT_AVATAR,
        });
    }
    async update(userId: string, body: UserUpdateDto): Promise<User> {
        return this.userModel.findByIdAndUpdate(userId, body, { new: true });
    }

    async updateInfoFirstRegister(userId: string, body: UserFirstUpdateDto) {
        try {
            let pass = true;
            const nameUser = this.handleFullName(body.name);
            const user = await this.userModel.findById(userId);
            if (!user)
                return handleResponse({
                    error: USER_NOT_FOUND,
                    statusCode: HttpStatus.NOT_FOUND,
                });

            if (!user.status.isFirstUpdate)
                return handleResponse({
                    error: ERROR_NO_PERRISSION,
                    statusCode: HttpStatus.FORBIDDEN,
                });
            if (body.email) {
                const isExist = await this.userModel.findOne({ email: body.email });
                if (isExist) {
                    pass = false;
                }
            }
            if (!pass)
                return handleResponse({
                    error: ERROR_EMAIL_HAS_BEEN_USED,
                    statusCode: HttpStatus.CONFLICT,
                });
            user.name = {
                firstName: nameUser.firstName,
                lastName: nameUser.lastName,
            };
            if (body.email) user.email = body.email;
            user.birthday = body.birthday.toString();
            user.gender = body.gender;
            user.status.isFirstUpdate = false;
            user.save();

            return handleResponse({
                message: FIRST_UPDATE_USER_SUCCESSFULLY,
                data: this.mapper.map(await user.populate('gender', 'name'), User as any, FirstUpdateDto),
            });
        } catch (error) {
            console.log(error);
            return handleResponse({
                error: error.response?.error || ERROR_FIRST_UPDATE_USER,
                statusCode: error.response?.statusCode || HttpStatus.BAD_REQUEST,
            });
        }
    }

    handleFullName(fullName: string): INameUser {
        if (!fullName)
            return {
                firstName: '',
                lastName: '',
            };

        const chars = fullName.split(' ');
        const firstName = chars[0];
        const lastName = chars.reduce((pre, curr, index) => {
            if (index !== 0) pre = pre + ' ' + curr;
            return pre.trim();
        }, '');

        return {
            firstName,
            lastName,
        };
    }

    getBeginDate() {
        const now = new Date();
        const date = now.getDate();
        const month = now.getMonth();
        const year = now.getFullYear();

        return new Date(year, month, date);
    }

    async getStrangeFriends(userId: string) {
        // Get me from database to get array friends id and array block id
        const me = await this.findById(userId);

        const matchedId = (await this.matchService.getAllSendByUserId(userId)).map((match) => match.toId.toString());

        const friendsId: string[] = me.friends.map((friendId) => friendId.toString());

        const blocksId: string[] = me.block.map((blockId) => blockId.toString());

        const blockedId: string[] = me.blocked.map((blockedId) => blockedId.toString());

        const exceptIds = [...friendsId, ...blocksId, ...blockedId, ...matchedId, userId];

        return await this.userModel
            .find({
                _id: { $nin: exceptIds },
                'lastLocation.updatedAt': { $ne: undefined },
                'status.isActive': true,
            })
            .populate([
                { path: 'hobbies', select: 'name' },
                { path: 'info.education', select: 'name' },
                { path: 'info.beer', select: 'name' },
                { path: 'gender', select: 'name' },
            ]);
    }

    async findStrangeFriendsAround(userId: string) {
        try {
            //Get radius from Setting collections
            const radius = 200; // meters

            const me = await this.findById(userId);
            if (!me)
                return handleResponse({
                    error: USER_NOT_FOUND,
                    statusCode: HttpStatus.BAD_REQUEST,
                });

            const strangeFriends = await this.getStrangeFriends(userId);
            if (!strangeFriends)
                return handleResponse({
                    error: ERROR_GET_USERS,
                    statusCode: HttpStatus.BAD_REQUEST,
                });

            const friendsAround: IStrangeUserAround[] = [];

            strangeFriends.forEach((user) => {
                if (user.lastLocation.latitude && user.lastLocation.longitude) {
                    const distance = this.getDistance(me.lastLocation, user.lastLocation);
                    if (this.getDistance(me.lastLocation, user.lastLocation) <= radius) {
                        friendsAround.push({
                            _id: user._id,
                            name: user.name,
                            avatar: user.avatar,
                            age: currentAge(user.birthday),
                            gender: user.gender,
                            lastLocation: user.lastLocation,
                            distance: Math.floor(distance),
                            info: user.info,
                            hobbies: user.hobbies,
                            profile: user.profile,
                        });
                    }
                }
            });
            return handleResponse({
                message: GET_STRANGE_FRIEND_SUCCESSFULLY,
                data: friendsAround,
            });
        } catch (error) {
            return handleResponse({
                error: error.response?.error || ERROR_GET_USERS,
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

    async addHobbies(userId: string, hobbies: string[]) {
        try {
            const user = await this.userModel.findById(userId);
            if (!user)
                return handleResponse({
                    error: USER_NOT_FOUND,
                    statusCode: HttpStatus.NOT_FOUND,
                });

            // user.hobbies.forEach((hobbyId) => {
            //     const indexHobby = hobbies.indexOf(hobbyId.toString());
            //     if (indexHobby > -1) {
            //         hobbies.splice(indexHobby, 1);
            //     }
            // });

            // if (hobbies.length === 0)
            //     return handleResponse({
            //         message: ADD_USER_HOBBIES_SUCCESSFULLY,
            //         data: user,
            //     });

            hobbies.forEach((hobby, index) => {
                hobbies[index] = new mongoose.Types.ObjectId(hobby).toString();
            });

            const updatedUser = await this.userModel.findOneAndUpdate(
                { _id: userId },
                { hobbies },
                {
                    new: true,
                },
            );

            await updatedUser.populate('hobbies', 'name');

            return handleResponse({
                message: ADD_USER_HOBBIES_SUCCESSFULLY,
                data: updatedUser.hobbies,
            });
        } catch (error) {
            return handleResponse({
                error: error.response?.error || ERROR_ADD_USER_HOBBIES,
                statusCode: error.response?.statusCode || HttpStatus.NOT_FOUND,
            });
        }
    }

    async updateBeer(userId: string, beerId: string) {
        try {
            const beer = await this.beerService.findById(beerId);
            if (!beer)
                return handleResponse({
                    error: BEER_NOT_FOUND,
                    statusCode: HttpStatus.NOT_FOUND,
                });

            const updatedUser = await this.userModel.findOneAndUpdate(
                { _id: userId },
                {
                    $set: {
                        'info.beer': new mongoose.Types.ObjectId(beerId).toString(),
                    },
                },
                { new: true },
            );
            if (!updatedUser)
                return handleResponse({
                    error: ERROR_UPDATE_USER_BEER,
                    statusCode: HttpStatus.BAD_REQUEST,
                });

            return handleResponse({
                message: UPDATE_USER_BEER_SUCCESSFULLY,
                data: this.mapper.map(beer, Beer as any, InfoDto),
            });
        } catch (error) {
            return handleResponse({
                error: error.response?.error || ERROR_UPDATE_USER_BEER,
                statusCode: error.response?.statusCode || HttpStatus.BAD_REQUEST,
            });
        }
    }

    async updateEducation(userId: string, educationId: string) {
        try {
            const education = await this.educationService.findById(educationId);
            if (!education)
                return handleResponse({
                    error: EDUCATION_NOT_FOUND,
                    statusCode: HttpStatus.NOT_FOUND,
                });

            const updatedUser = await this.userModel.findOneAndUpdate(
                { _id: userId },
                {
                    $set: {
                        'info.education': new mongoose.Types.ObjectId(educationId).toString(),
                    },
                },
                { new: true },
            );
            if (!updatedUser)
                return handleResponse({
                    error: ERROR_UPDATE_USER_EDUCATION,
                    statusCode: HttpStatus.BAD_REQUEST,
                });

            return handleResponse({
                message: UPDATE_USER_EDUCATION_SUCCESSFULLY,
                data: this.mapper.map(education, Education as any, InfoDto),
            });
        } catch (error) {
            return handleResponse({
                error: error.response?.error || ERROR_UPDATE_USER_EDUCATION,
                statusCode: error.response?.statusCode || HttpStatus.BAD_REQUEST,
            });
        }
    }

    async updateReligion(userId: string, religion: boolean) {
        try {
            const updatedUser = await this.userModel.findOneAndUpdate(
                { _id: userId },
                {
                    $set: {
                        'info.religion': religion,
                    },
                },
                { new: true },
            );
            if (!updatedUser)
                return handleResponse({
                    error: ERROR_UPDATE_USER_RELIGION,
                    statusCode: HttpStatus.BAD_REQUEST,
                });

            return handleResponse({
                message: UPDATE_USER_RELIGION_SUCCESSFULLY,
                data: religion,
            });
        } catch (error) {
            console.log(error);
            return handleResponse({
                error: error.response?.error || ERROR_UPDATE_USER_RELIGION,
                statusCode: error.response?.statusCode || HttpStatus.BAD_REQUEST,
            });
        }
    }

    async updateGender(userId: string, genderId: string) {
        try {
            const gender = await this.genderService.findById(genderId);
            if (!gender)
                return handleResponse({
                    error: GENDER_NOT_FOUND,
                    statusCode: HttpStatus.NOT_FOUND,
                });
            console.log(gender);

            const updatedUser = await this.userModel.findOneAndUpdate(
                { _id: userId },
                {
                    $set: {
                        gender: new mongoose.Types.ObjectId(genderId).toString(),
                    },
                },
                { new: true },
            );
            if (!updatedUser)
                return handleResponse({
                    error: ERROR_UPDATE_USER_GENDER,
                    statusCode: HttpStatus.BAD_REQUEST,
                });

            return handleResponse({
                message: UPDATE_USER_GENDER_SUCCESSFULLY,
                data: this.mapper.map(gender, Gender, InfoDto),
            });
        } catch (error) {
            console.log(error);
            return handleResponse({
                error: error.response?.error || ERROR_UPDATE_USER_GENDER,
                statusCode: error.response?.statusCode || HttpStatus.BAD_REQUEST,
            });
        }
    }

    async deleteHobbies(userId: string, hobbies: string[]) {
        try {
            hobbies.forEach((hobby, index) => {
                hobbies[index] = new mongoose.Types.ObjectId(hobby).toString();
            });

            const user = await this.userModel.findOneAndUpdate(
                { _id: userId },
                {
                    $pull: {
                        hobbies: { $each: hobbies },
                    },
                },
            );
            if (!user)
                return handleResponse({
                    error: ERROR_DELETE_USER_HOBBY,
                    statusCode: HttpStatus.BAD_REQUEST,
                });

            return handleResponse({
                message: DELETE_USER_HOBBY_SUCCESSFULLY,
                data: hobbies,
            });
        } catch (error) {
            console.log(error);
            return handleResponse({
                error: error.response?.error ? error.response.error : ERROR_DELETE_USER_HOBBY,
                statusCode: error.response?.statusCode ? error.response.statusCode : HttpStatus.BAD_REQUEST,
            });
        }
    }

    async uploadAlbums(userId: string, albums: Array<Express.Multer.File>) {
        try {
            if (albums && albums.length > 0) {
                const user = await this.userModel.findById(userId);
                if (!user)
                    return handleResponse({
                        error: USER_NOT_FOUND,
                        statusCode: HttpStatus.NOT_FOUND,
                    });

                if (user.profile.albums.length >= +process.env.MAX_IMAGE)
                    return handleResponse({
                        error: ALBUMS_IS_FULL,
                        statusCode: HttpStatus.BAD_REQUEST,
                    });

                if (user.profile.albums.length + albums.length > +process.env.MAX_IMAGE)
                    return handleResponse({
                        error: EXCEED_ALBUMS_LENGTH,
                        statusCode: HttpStatus.BAD_REQUEST,
                    });

                // const userAlbums: IImage[] = [];

                for (const image of albums) {
                    await this.httpService.axiosRef
                        .post(`${process.env.UPLOAD_IMAGE_URL}${image.originalname}`, Buffer.from(image.buffer))
                        .then(function (response) {
                            console.log(response.data.longURL);
                            user.profile.albums.push({
                                url: response.data.longURL,
                                isDefault: false,
                                isFavorite: false,
                            });
                        });
                }
                console.log(user.profile.albums);

                await user.save();

                return handleResponse({
                    message: UPLOAD_ALBUMS_SUCCESSFULLY,
                    data: user.profile.albums,
                });
            }
        } catch (error) {
            return handleResponse({
                error: error.response?.error || ERROR_UPDATE_USER_ALBUMS,
                statusCode: error.response?.statusCode || HttpStatus.BAD_REQUEST,
            });
        }
    }

    async updateBio(userId: string, bio: string) {
        try {
            const user = await this.userModel.findOneAndUpdate(
                { _id: userId },
                {
                    $set: {
                        'profile.bio': bio,
                    },
                },
            );
            if (!user)
                return handleResponse({
                    error: ERROR_UPDATE_USER_BIO,
                    statusCode: HttpStatus.BAD_REQUEST,
                });

            return handleResponse({
                message: UPDATE_USER_BIO_SUCCESSFULLY,
                data: bio,
            });
        } catch (error) {
            return handleResponse({
                error: error.response?.error ? error.response.error : ERROR_UPDATE_USER_BIO,
                statusCode: error.response?.statusCode ? error.response.statusCode : HttpStatus.BAD_REQUEST,
            });
        }
    }

    async updateCommonInfo(userId: string, avatar: Express.Multer.File, body: CommonInfoDto) {
        try {
            console.log('avatar: ', avatar);
            const result = {};
            const user = await this.userModel.findById(userId);
            if (!user) {
                return handleResponse({
                    error: USER_NOT_FOUND,
                    statusCode: HttpStatus.NOT_FOUND,
                });
            }
            if (avatar) {
                await this.httpService.axiosRef
                    .post(`${process.env.UPLOAD_IMAGE_URL}${avatar.originalname}`, Buffer.from(avatar.buffer))
                    .then(function (response) {
                        console.log(response.data.longURL);
                        user.avatar = response.data.longURL;
                        result['avatar'] = response.data.longURL;
                    });
            }

            if (body.name) {
                const nameUser = this.handleFullName(body.name);

                user.name.firstName = nameUser.firstName;
                user.name.lastName = nameUser.lastName;
                result['name'] = user.name;
            }
            if (body.birthday) {
                user.birthday = body.birthday.toString();
                result['birthday'] = user.birthday;
            }

            await user.save();

            return handleResponse({
                message: UPDATE_USER_COMMON_INFO_SUCCESSFULLY,
                data: { ...result },
            });
        } catch (error) {
            console.log('error: ', error);

            return handleResponse({
                error: error.response?.error ? error.response.error : ERROR_UPDATE_COMMON_INFO,
                statusCode: error.response?.statusCode ? error.response.statusCode : HttpStatus.BAD_REQUEST,
            });
        }
    }

    async updateReason(userId: string, reason: string) {
        try {
            const user = await this.userModel.findOneAndUpdate(
                { _id: userId },
                {
                    $set: {
                        'info.reason': reason,
                    },
                },
            );
            if (!user)
                return handleResponse({
                    error: ERROR_UPDATE_USER_REASON,
                    statusCode: HttpStatus.BAD_REQUEST,
                });

            return handleResponse({
                message: UPDATE_USER_REASON_SUCCESSFULLY,
                data: reason,
            });
        } catch (error) {
            return handleResponse({
                error: error.response?.error ? error.response.error : ERROR_UPDATE_USER_REASON,
                statusCode: error.response?.statusCode ? error.response.statusCode : HttpStatus.BAD_REQUEST,
            });
        }
    }

    async updateFavoriteImage(userId: string, url: string) {
        try {
            const user = await this.userModel.findById(userId);
            if (!user) {
                return handleResponse({
                    error: USER_NOT_FOUND,
                    statusCode: HttpStatus.NOT_FOUND,
                });
            }

            const favoriteImage = user.profile.albums.find((image) => image.url === url);
            favoriteImage.isFavorite = !favoriteImage.isFavorite;
            favoriteImage.isDefault = false;

            await user.save();

            return handleResponse({
                message: UPDATE_USER_FARVORITE_IMAGE_SUCCESSFULLY,
                data: favoriteImage,
            });
        } catch (error) {
            return handleResponse({
                error: error.response?.error ? error.response.error : ERROR_UPDATE_USER_FARVORITE_IMAGE,
                statusCode: error.response?.statusCode ? error.response.statusCode : HttpStatus.BAD_REQUEST,
            });
        }
    }

    async updateDefaultImage(userId: string, url: string) {
        try {
            const user = await this.userModel.findById(userId);
            if (!user) {
                return handleResponse({
                    error: USER_NOT_FOUND,
                    statusCode: HttpStatus.NOT_FOUND,
                });
            }

            const defaultImage = user.profile.albums.find((image) => image.url === url);
            defaultImage.isDefault = !defaultImage.isDefault;
            defaultImage.isFavorite = false;

            await user.save();

            return handleResponse({
                message: UPDATE_USER_DEFAULT_IMAGE_SUCCESSFULLY,
                data: defaultImage,
            });
        } catch (error) {
            return handleResponse({
                error: error.response?.error ? error.response.error : ERROR_UPDATE_USER_DEFAULT_IMAGE,
                statusCode: error.response?.statusCode ? error.response.statusCode : HttpStatus.BAD_REQUEST,
            });
        }
    }

    async deleteImage(userId: string, url: string) {
        try {
            console.log('vo khong');
            const user = await this.userModel.findById(userId);
            if (!user) {
                return handleResponse({
                    error: USER_NOT_FOUND,
                    statusCode: HttpStatus.NOT_FOUND,
                });
            }

            const indexImage = user.profile.albums.findIndex((image) => image.url === url);
            if (indexImage >= 0) {
                user.profile.albums.splice(indexImage, 1);
            }

            await user.save();

            return handleResponse({
                message: DELETE_IMAGE_ALBUMS_SUCCESSFULLY,
                data: url,
            });
        } catch (error) {
            console.log(error);
            return handleResponse({
                error: error.response?.error ? error.response.error : ERROR_DELETE_IMAGE_ALBUMS,
                statusCode: error.response?.statusCode ? error.response.statusCode : HttpStatus.BAD_REQUEST,
            });
        }
    }

    async updateHeight(userId: string, height: number) {
        try {
            const updateUser = await this.userModel.findOneAndUpdate(
                { _id: userId },
                {
                    $set: {
                        'info.height': height,
                    },
                },
                { new: true },
            );
            if (!updateUser) {
                return handleResponse({
                    error: ERROR_UPDATE_USER_HEIGHT,
                    statusCode: HttpStatus.BAD_REQUEST,
                });
            }

            return handleResponse({
                message: UPDATE_USER_HEIGHT_SUCCESSFULLY,
                data: height,
            });
        } catch (error) {
            return handleResponse({
                error: error.response?.error ? error.response.error : ERROR_UPDATE_USER_HEIGHT,
                statusCode: error.response?.statusCode ? error.response.statusCode : HttpStatus.BAD_REQUEST,
            });
        }
    }
}
