import { Module } from '@nestjs/common';
import { HobbyService } from './hobby.service';
import { HobbyController } from './hobby.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Hobby, HobbySchema } from 'src/schemas/hobby.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Hobby.name, schema: HobbySchema }])],
    controllers: [HobbyController],
    providers: [HobbyService],
})
export class HobbyModule {}
