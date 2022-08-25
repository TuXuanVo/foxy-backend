import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthProfile } from 'src/auth/auth.profile';
import { BeerModule } from 'src/beer/beer.module';
import { ConversationModule } from 'src/conversation/conversation.module';
import { EducationModule } from 'src/education/education.module';
import { GenderModule } from 'src/gender/gender.module';
import { MatchModule } from 'src/match/match.module';
import { NotificationModule } from 'src/notification/notification.module';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        NotificationModule,
        ConversationModule,
        MatchModule,
        BeerModule,
        EducationModule,
        GenderModule,
        HttpModule,
    ],
    providers: [UserService, AuthProfile],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule {}
