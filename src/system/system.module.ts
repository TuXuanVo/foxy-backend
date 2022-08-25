import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { SystemController } from './system.controller';
import { System, SystemSchema } from 'src/schemas/system.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [MongooseModule.forFeature([{ name: System.name, schema: SystemSchema }])],
    providers: [SystemService],
    exports: [SystemService],
    controllers: [SystemController],
})
export class SystemModule {}
