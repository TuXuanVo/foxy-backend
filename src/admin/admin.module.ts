import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from 'src/schemas/admin.schema';
import { BeerModule } from 'src/beer/beer.module';
import { GenderModule } from 'src/gender/gender.module';
import { EducationModule } from 'src/education/education.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
        BeerModule,
        GenderModule,
        EducationModule,
    ],
    providers: [AdminService],
    controllers: [AdminController],
    exports: [AdminService],
})
export class AdminModule {}
