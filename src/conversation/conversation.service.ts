import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isMongoId } from 'class-validator';
import { DeleteResult } from 'mongodb';
import { Model, ObjectId } from 'mongoose';
import { env } from 'process';
import {
    ERROR_CONVERSATION_NOT_FOUND,
    ERROR_GET_ALL_CONVERSATIONS,
    ERROR_GET_CONVERSATION,
    ERROR_ID_INVALID,
    GET_ALL_CONVERSATIONS_SUCCESSFULLY,
    GET_CONVERSATION_SUCCESSFULLY,
} from 'src/constance/responseCode';
import { handleResponse } from 'src/dto/response/Response.dto';
import { Conversation, ConversationDocument } from 'src/schemas/conversation.schema';

@Injectable()
export class ConversationService {
    constructor(@InjectModel(Conversation.name) private conversationModel: Model<ConversationDocument>) {}

    async createConversation(userAId: ObjectId, userBId: ObjectId): Promise<Conversation> {
        const conversation = await this.conversationModel.create({
            users: [userAId, userBId],
        });

        return conversation;
    }
    async getConversationById(
        userId: string,
        id: string,
        limit = +process.env.MESSAGE_LIMIT_DEFAULT || 20,
        page = +process.env.MESSAGE_PAGE_DEFAULT || 1,
    ) {
        try {
            if (!isMongoId(id))
                return handleResponse({
                    error: ERROR_ID_INVALID,
                    statusCode: HttpStatus.BAD_REQUEST,
                });
            const conversationCount = (
                await this.conversationModel.findOne({
                    _id: id,
                    users: {
                        $in: [userId],
                    },
                })
            ).messages.length;
            const conversation = await this.conversationModel
                .findOne({
                    _id: id,
                    users: {
                        $in: [userId],
                    },
                })
                .populate({
                    path: 'messages',
                    options: { sort: { createdAt: -1 }, limit: limit, skip: (page - 1) * limit },
                    populate: {
                        path: 'senderId',
                        select: 'name avatar email',
                    },
                })
                .populate('users', 'name avatar lastLogin');
            if (!conversation)
                return handleResponse({
                    error: ERROR_CONVERSATION_NOT_FOUND,
                    statusCode: HttpStatus.NOT_FOUND,
                });
            console.log(conversationCount > page * limit);
            return handleResponse({
                message: GET_CONVERSATION_SUCCESSFULLY,
                data: { conversation, limit: +limit, page: +page, next: conversationCount > page * limit },
            });
        } catch (error) {
            return handleResponse({
                error: ERROR_GET_CONVERSATION,
                statusCode: HttpStatus.BAD_REQUEST,
            });
        }
    }
    async getAllConversationByUser(userId: string) {
        try {
            const conversations = await this.conversationModel
                .find({
                    users: {
                        $in: [userId],
                    },
                })
                .populate('users', 'name avatar lastLogin')
                .populate({
                    path: 'messages',
                    options: { sort: { createdAt: -1 }, limit: 1, skip: 0 },
                    populate: {
                        path: 'senderId',
                        select: 'name avatar email',
                    },
                })
                .select('users updatedAt')
                .sort({ updatedAt: -1 });
            return handleResponse({
                message: GET_ALL_CONVERSATIONS_SUCCESSFULLY,
                data: conversations.map((conversation) => ({
                    conversation: {
                        ...conversation.toObject(),
                    },
                    limit: 0,
                    page: 0,
                    next: true,
                })),
            });
        } catch (error) {
            return handleResponse({
                error: error.response?.error || ERROR_GET_ALL_CONVERSATIONS,
                statusCode: error.response?.statusCode || HttpStatus.BAD_REQUEST,
            });
        }
    }
    async delete(userAId: string, userBId: string): Promise<DeleteResult> {
        return this.conversationModel.deleteOne({
            users: {
                $all: [userAId, userBId],
            },
        });
    }
}
