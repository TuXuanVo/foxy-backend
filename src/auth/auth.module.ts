import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from 'src/admin/admin.module';
import { BeerModule } from 'src/beer/beer.module';
import { ConversationModule } from 'src/conversation/conversation.module';
import { EducationModule } from 'src/education/education.module';
import { GenderModule } from 'src/gender/gender.module';
import { JwtGuard } from 'src/guards/jwt.guard';
import { MatchModule } from 'src/match/match.module';
import { NotificationModule } from 'src/notification/notification.module';
import { User, UserSchema } from 'src/schemas/user.schema';
import { FacebookStrategy } from 'src/strategies/facebook.strategy';
import { GoogleStrategy } from 'src/strategies/google.strategy';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { AuthProfile } from './auth.profile';
import { AuthService } from './auth.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MatchModule,
        ConversationModule,
        NotificationModule,
        AdminModule,
        BeerModule,
        EducationModule,
        GenderModule,
        HttpModule,
    ],
    controllers: [AuthController],
    providers: [
        UserService,
        JwtGuard,
        JwtStrategy,
        JwtService,
        ConfigService,
        AuthService,
        FacebookStrategy,
        GoogleStrategy,
        AuthProfile,
    ],
})
export class AuthModule {}
