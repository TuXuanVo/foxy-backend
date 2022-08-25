import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TwilioModule } from 'nestjs-twilio';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MatchModule } from './match/match.module';
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';
import { GiftModule } from './gift/gift.module';
import { GiftLogModule } from './gift-log/gift-log.module';
import { NotificationModule } from './notification/notification.module';
import { MapModule } from './map/map.module';
import { AdminModule } from './admin/admin.module';
import { SystemModule } from './system/system.module';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { CamelCaseNamingConvention } from '@automapper/core';
import { HobbyModule } from './hobby/hobby.module';
import { BeerModule } from './beer/beer.module';
import { GenderModule } from './gender/gender.module';
import { EducationModule } from './education/education.module';
import { EventsModule } from './event/event.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env.development', '.env.production', '.env'],
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (cfg: ConfigService) => ({
                uri: cfg.get('MONGODB_URI'),
                useNewUrlParser: true,
            }),
            inject: [ConfigService],
        }),
        TwilioModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (cfg: ConfigService) => ({
                accountSid: cfg.get('TWILIO_ACCOUNT_SID'),
                authToken: cfg.get('TWILIO_AUTH_TOKEN'),
            }),
            inject: [ConfigService],
        }),
        AutomapperModule.forRoot({
            strategyInitializer: classes(),
            namingConventions: new CamelCaseNamingConvention(),
        }),
        EventsModule,
        UserModule,
        AuthModule,
        MatchModule,
        ConversationModule,
        MessageModule,
        GiftModule,
        GiftLogModule,
        NotificationModule,
        MapModule,
        AdminModule,
        SystemModule,
        HobbyModule,
        BeerModule,
        GenderModule,
        EducationModule,
    ],
})
export class AppModule {}
