import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { Match, MatchSchema } from 'src/schemas/match.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [MongooseModule.forFeature([{ name: Match.name, schema: MatchSchema }])],
    providers: [MatchService],
    controllers: [MatchController],
    exports: [MatchService],
})
export class MatchModule {}
