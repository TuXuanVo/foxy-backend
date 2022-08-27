import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isMongoId } from 'class-validator';
import { Model } from 'mongoose';
import {
    ERROR_ID_INVALID,
    ERROR_NOTIFICATION_NOT_FOUND,
    ERROR_UPDATE_NOTIFICATION,
    GET_ALL_NOTIFICATION_SUCCESSFULLY,
    UPDATE_NOTIFICATION_SUCCESSFULLY,
} from 'src/constance/responseCode';
import { handleResponse } from 'src/dto/response/Response.dto';
import { NotificationGateway } from 'src/event/notification.gateway';
import { Notification, NotificationDocument, NotificationType } from 'src/schemas/notification.schema';

@Injectable()
export class NotificationService {
    constructor(
        private readonly notificationGateway: NotificationGateway,
        @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    ) {}
    create(notification: iNotificationCreate): Promise<NotificationDocument> {
        return this.notificationModel.create(notification);
    }
    async delete(userId: string, notiId: string) {
        try {
            const result = await this.notificationModel.deleteOne({ _id: notiId, user: userId });
            if (result.deletedCount === 0) throw new NotFoundException('Notification not found');
            return {
                message: 'Deleted notification successfully',
                data: {
                    _id: notiId,
                },
            };
        } catch (error) {
            if (error.name === 'CastError') throw new BadRequestException('Id is invalid');
            throw error;
        }
    }
    async updateSeen(userId: string, notiId: string) {
        try {
            if (!isMongoId(notiId) || !isMongoId(userId))
                return handleResponse({
                    error: ERROR_ID_INVALID,
                    statusCode: HttpStatus.BAD_REQUEST,
                });
            const noti = await this.notificationModel.findOneAndUpdate(
                { _id: notiId, 'user.0': userId },
                { hasSeen: true },
                { new: true },
            );
            if (!noti) {
                return handleResponse({
                    error: ERROR_NOTIFICATION_NOT_FOUND,
                    statusCode: HttpStatus.NOT_FOUND,
                });
            }
            return handleResponse({
                message: UPDATE_NOTIFICATION_SUCCESSFULLY,
                data: noti,
            });
        } catch (error) {
            return handleResponse({
                error: error.response?.error || ERROR_UPDATE_NOTIFICATION,
                statusCode: error.response?.statusCode || HttpStatus.BAD_REQUEST,
            });
        }
    }
    async like(toUser: string): Promise<NotificationDocument> {
        const notification = await this.create({
            type: NotificationType.LIKE,
            message: `Ai đó vừa thích bạn`,
            user: [toUser],
        });
        //* Send notification to client
        this.notificationGateway.sendNotification(toUser, notification, 'notification');
        return notification;
    }
    async match(fromUser: iMatchUser, toUser: iMatchUser): Promise<[NotificationDocument, NotificationDocument]> {
        const noti1 = await this.notificationModel.create({
            type: NotificationType.MATCH,
            message: 'Bạn và ' + fromUser.name.firstName + ' ' + fromUser.name.lastName + ' đã trở thành bạn bè',
            user: [toUser._id, fromUser._id],
        });
        await noti1.populate('user', 'email avatar name');
        const noti2 = await this.notificationModel.create({
            type: NotificationType.MATCH,
            message: 'Bạn và ' + toUser.name.firstName + ' ' + toUser.name.lastName + ' đã trở thành bạn bè',
            user: [fromUser._id, toUser._id],
        });
        await noti2.populate('user', 'email avatar name');
        //* Send notification to client
        this.notificationGateway.sendNotification(toUser._id.toString(), noti1, 'notification');
        this.notificationGateway.sendNotification(fromUser._id.toString(), noti2, 'notification');
        return [noti1, noti2];
    }
    async gift(sendUser: string, toUser: string): Promise<NotificationDocument> {
        return this.create({
            type: NotificationType.GIFT,
            message: `Bạn đã nhận một món quà từ ${sendUser}`,
            user: [toUser],
        });
    }
    async getAllByUser(userId: string) {
        return handleResponse({
            message: GET_ALL_NOTIFICATION_SUCCESSFULLY,
            data: await this.notificationModel
                .find({
                    'user.0': userId,
                })
                .sort({ createdAt: -1 })
                .populate('user', 'email avatar name'),
        });
    }
}
