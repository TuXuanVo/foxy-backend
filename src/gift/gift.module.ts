import { Module } from '@nestjs/common';
import { GiftService } from './gift.service';
import { GiftController } from './gift.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Gift, GiftSchema } from 'src/schemas/gift.schema';
import { GiftLogModule } from 'src/gift-log/gift-log.module';
import { UserModule } from 'src/user/user.module';
import { JwtGuard } from 'src/guards/jwt.guard';
import { JwtService } from '@nestjs/jwt';
import { SystemModule } from 'src/system/system.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Gift.name, schema: GiftSchema }]),
        GiftLogModule,
        UserModule,
        SystemModule,
    ],
    providers: [GiftService, JwtGuard, JwtService],
    controllers: [GiftController],
})
export class GiftModule {}
