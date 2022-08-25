import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ERROR_GET_ALL_HOBBIES, GET_ALL_HOBBIES_SUCCESSFULLY } from 'src/constance/responseCode';
import { UpdateHobbyDto } from 'src/dto/request/Hobby.dto';
import { handleResponse } from 'src/dto/response/Response.dto';
import { Hobby, HobbyDocument } from 'src/schemas/hobby.schema';

@Injectable()
export class HobbyService {
    constructor(@InjectModel(Hobby.name) private hobbyModel: Model<HobbyDocument>) {}

    create(name: string) {
        try {
            return this.hobbyModel.create({ name });
        } catch (error) {
            return handleResponse({
                error: error.message,
                statusCode: 409,
            });
        }
    }

    async findAll() {
        try {
            return handleResponse({
                message: GET_ALL_HOBBIES_SUCCESSFULLY,
                data: await this.hobbyModel.find(),
            });
        } catch (error) {
            return handleResponse({
                error: error.response?.error || ERROR_GET_ALL_HOBBIES,
                statusCode: error.response?.statusCode || HttpStatus.BAD_REQUEST,
            });
        }
    }

    async updateHobbyById(id: string, updateHobbyDto: UpdateHobbyDto) {
        try {
            const hobby = await this.hobbyModel.findById(id);
            if (!hobby) {
                throw new BadRequestException('Hobby not found');
            }
            const { name } = updateHobbyDto;
            if (name) {
                hobby.name = name;
            }
            return hobby.save();
        } catch (error) {
            return handleResponse({
                error: error.message,
                statusCode: 409,
            });
        }
    }

    async remove(id: string) {
        await this.hobbyModel.findByIdAndRemove(id);
        return null;
    }
}
