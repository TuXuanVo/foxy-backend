import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationSchema } from 'src/schemas/notification.schema';
import { EventsModule } from 'src/event/event.module';
import { NotificationGateway } from 'src/event/notification.gateway';
import { JwtService } from '@nestjs/jwt';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: 'Notification', schema: NotificationSchema }]),
        EventsModule,
    ],
    providers: [NotificationService, NotificationGateway, JwtService],
    controllers: [NotificationController],
    exports: [NotificationService],
})
export class NotificationModule {}
