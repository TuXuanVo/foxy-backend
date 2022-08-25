import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { Conversation, ConversationSchema } from 'src/schemas/conversation.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [MongooseModule.forFeature([{ name: Conversation.name, schema: ConversationSchema }])],
    providers: [ConversationService],
    controllers: [ConversationController],
    exports: [ConversationService],
})
export class ConversationModule {}
