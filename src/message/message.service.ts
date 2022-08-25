import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CREATE_MESSAGE_SUCCESSFULLY, ERROR_CREATE_MESSAGE } from 'src/constance/responseCode';
import { MessageCreateDto } from 'src/dto/request/Message.dto';
import { handleResponse } from 'src/dto/response/Response.dto';
import { NotificationGateway } from 'src/event/notification.gateway';
import { Conversation, ConversationDocument } from 'src/schemas/conversation.schema';
import { Message, MessageDocument } from 'src/schemas/message.schema';

@Injectable()
export class MessageService {
    constructor(
        private readonly notificationGateway: NotificationGateway,
        @InjectModel(Conversation.name) private conversationModel: Model<ConversationDocument>,
        @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
        private readonly httpService: HttpService,
    ) {}
    async create(userId: string, body: MessageCreateDto, images: Array<Express.Multer.File>) {
        try {
            const messages: any[] = JSON.parse(body.messages);
            if (images.length !== 0) {
                const imagesLink: string[] = [];
                for (const image of images) {
                    await this.httpService.axiosRef
                        .post(`${process.env.UPLOAD_IMAGE_URL}${image.originalname}`, Buffer.from(image.buffer))
                        .then(function (response) {
                            imagesLink.push(response.data.longURL);
                        });
                }
                messages.push({
                    type: 'image',
                    value: imagesLink,
                });
            }
            let conversation = await this.conversationModel.findOne({
                users: { $all: [userId, body.idReceive] },
            });
            const newMessage = await this.messageModel.create({
                senderId: userId,
                receiverId: body.idReceive,
                messages,
                exp: body.exp ? Date.now() + body.exp * 1000 * 60 : undefined,
            });
            await newMessage.populate('senderId', 'name avatar email');
            if (!conversation) {
                conversation = await this.conversationModel.create({
                    users: [userId, body.idReceive],
                    messages: [newMessage._id],
                });
            } else {
                conversation.messages.push(newMessage._id as string & Message & Document);
                await conversation.save();
            }
            this.notificationGateway.sendNotification(
                body.idReceive,
                {
                    conversationId: conversation._id,
                    message: newMessage,
                },
                'message',
            );
            return handleResponse({
                message: CREATE_MESSAGE_SUCCESSFULLY,
                data: {
                    message: newMessage,
                    conversationId: conversation._id,
                },
            });
        } catch (error) {
            return handleResponse({
                error: error.response?.error || ERROR_CREATE_MESSAGE,
                statusCode: error.response?.statusCode || HttpStatus.BAD_REQUEST,
            });
        }
    }
}
