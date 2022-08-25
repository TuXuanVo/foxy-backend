import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { NotificationService } from 'src/notification/notification.service';
import { GiftLog, GiftLogDocument } from 'src/schemas/giftLog.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GiftLogService {
    constructor(
        @InjectModel(GiftLog.name) private giftLogModel: Model<GiftLogDocument>,
        private readonly notificationService: NotificationService,
        private readonly userService: UserService,
    ) {}

    async createSendGiftLog(sendId: string, receiveId: string, giftId: string) {
        try {
            const giftLog = await this.giftLogModel.create({
                senderId: sendId,
                receiverId: receiveId,
                gift: giftId,
                quantity: 1,
            });
            const nameSend = (await this.userService.findById(sendId)).name;
            await this.notificationService.gift(nameSend.firstName + ' ' + nameSend.lastName, receiveId);
            return {
                message: 'Created gift log successfully',
                data: {
                    giftLog,
                },
            };
        } catch (error) {
            throw new BadRequestException('Something went wrong');
        }
    }

    async createBuyGiftLog(userId: string, giftId: string, quantity: number) {
        try {
            return await this.giftLogModel.create({
                senderId: userId,
                receiverId: userId,
                gift: giftId,
                quantity,
            });
        } catch (error) {
            throw new BadRequestException('Something went wrong');
        }
    }
}
