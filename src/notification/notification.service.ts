import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GET_ALL_NOTIFICATION_SUCCESSFULLY } from 'src/constance/responseCode';
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
    async updateSeen(userId: string, notiId: string, hasSeen?: boolean) {
        try {
            const noti = await this.notificationModel.findOneAndUpdate(
                { _id: notiId, user: userId },
                { hasSeen: hasSeen ? hasSeen : true },
                { new: true },
            );
            if (!noti) {
                throw new BadRequestException('Notification not found');
            }
            return {
                message: 'Notification updated',
                data: noti,
            };
        } catch (error) {
            throw error;
        }
    }
    async like(toUser: string): Promise<NotificationDocument> {
        const notification = await this.create({
            type: NotificationType.LIKE,
            message: `Ai đó vừa thích bạn`,
            user: toUser,
        });
        //* Send notification to client
        this.notificationGateway.sendNotification(toUser, notification, 'notification');
        return notification;
    }
    async match(fromUser: iMatchUser, toUser: iMatchUser): Promise<[NotificationDocument, NotificationDocument]> {
        const [noti1, noti2] = await Promise.all([
            this.create({
                type: NotificationType.MATCH,
                message: 'Bạn và ' + fromUser.name.firstName + ' ' + fromUser.name.lastName + ' đã trở thành bạn bè',
                user: toUser._id,
            }),
            this.create({
                type: NotificationType.MATCH,
                message: 'Bạn và ' + toUser.name.firstName + ' ' + toUser.name.lastName + ' đã trở thành bạn bè',
                user: fromUser._id,
            }),
        ]);
        //* Send notification to client
        this.notificationGateway.sendNotification(toUser._id, noti1, 'notification');
        this.notificationGateway.sendNotification(fromUser._id, noti2, 'notification');
        return [noti1, noti2];
    }
    async gift(sendUser: string, toUser: string): Promise<NotificationDocument> {
        return this.create({
            type: NotificationType.GIFT,
            message: `Bạn đã nhận một món quà từ ${sendUser}`,
            user: toUser,
        });
    }
    async getAllByUser(userId: string) {
        return handleResponse({
            message: GET_ALL_NOTIFICATION_SUCCESSFULLY,
            data: await this.notificationModel.find({ user: userId }).sort({ createdAt: -1 }),
        });
    }
}
