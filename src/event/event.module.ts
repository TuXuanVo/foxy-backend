import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User, UserSchema } from 'src/schemas/user.schema';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { NotificationGateway } from './notification.gateway';

@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
    providers: [NotificationGateway, JwtGuard, JwtStrategy, JwtService],
})
export class EventsModule {}
