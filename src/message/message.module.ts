import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { Message, MessageSchema } from 'src/schemas/message.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Conversation, ConversationSchema } from 'src/schemas/conversation.schema';
import { EventsModule } from 'src/event/event.module';
import { NotificationGateway } from 'src/event/notification.gateway';
import { JwtService } from '@nestjs/jwt';
import { User, UserSchema } from 'src/schemas/user.schema';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: Conversation.name, schema: ConversationSchema }]),
        MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
        EventsModule,
        HttpModule,
    ],
    providers: [MessageService, NotificationGateway, JwtService],
    controllers: [MessageController],
})
export class MessageModule {}
