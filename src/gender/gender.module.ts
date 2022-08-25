import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Gender, GenderSchema } from 'src/schemas/gender.schema';
import { GenderService } from './gender.service';
import { GenderController } from './gender.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: Gender.name, schema: GenderSchema }])],
    providers: [GenderService],
    exports: [GenderService],
    controllers: [GenderController],
})
export class GenderModule {}
