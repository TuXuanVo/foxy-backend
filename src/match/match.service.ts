import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Match, MatchDocument } from 'src/schemas/match.schema';

@Injectable()
export class MatchService {
    constructor(@InjectModel(Match.name) private matchModel: Model<MatchDocument>) {}

    async getAllSendByUserId(userId: string) {
        return await this.matchModel.find({ fromId: userId });
    }

    async isAMatchB(userAId: string, userBId: string): Promise<string> {
        const aMatchB = await this.matchModel.findOne({ fromId: userAId, toId: userBId });
        if (aMatchB) return aMatchB._id;
        return null;
    }
    async create(idFrom: string, idTo: string) {
        const match = await this.matchModel.findOne({ fromId: idFrom, toId: idTo });
        if (!match)
            return await this.matchModel.create({
                fromId: idFrom,
                toId: idTo,
            });
        throw new BadRequestException('You already have a match');
    }

    async delete(matchId: string) {
        try {
            const result = await this.matchModel.deleteOne({ _id: matchId });
            if (result.deletedCount === 0) throw new NotFoundException('Match not found');
            return {
                message: 'Deleted match successfully',
                data: {
                    _id: matchId,
                },
            };
        } catch (error) {
            if (error.name === 'CastError') throw new BadRequestException('Id is invalid');
            throw error;
        }
    }
}
