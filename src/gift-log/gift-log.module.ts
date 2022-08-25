import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationModule } from 'src/notification/notification.module';
import { GiftLog, GiftLogSchema } from 'src/schemas/giftLog.schema';
import { UserModule } from 'src/user/user.module';
import { GiftLogService } from './gift-log.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: GiftLog.name, schema: GiftLogSchema }]),
        UserModule,
        NotificationModule,
    ],
    providers: [GiftLogService],
    exports: [GiftLogService],
})
export class GiftLogModule {}
