import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Beer, BeerSchema } from 'src/schemas/beer.schema';
import { BeerService } from './beer.service';
import { BeerController } from './beer.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: Beer.name, schema: BeerSchema }])],
    providers: [BeerService],
    exports: [BeerService],
    controllers: [BeerController],
})
export class BeerModule {}
