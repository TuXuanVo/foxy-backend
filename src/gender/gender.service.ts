import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    CREATE_GENDER_SUCCESSFULLY,
    DELETE_GENDER_SUCCESSFULLY,
    ERROR_CREATE_GENDER,
    ERROR_DELETE_GENDER,
    ERROR_GET_GENDERS,
    ERROR_UPDATE_GENDER,
    GET_GENDERS_SUCCESSFULLY,
    UPDATE_GENDER_SUCCESSFULLY,
} from 'src/constance/responseCode';
import { InfoDto } from 'src/dto/response/Auth.dto';
import { handleResponse } from 'src/dto/response/Response.dto';
import { Gender, GenderDocument } from 'src/schemas/gender.schema';

@Injectable()
export class GenderService {
    constructor(
        @InjectModel(Gender.name) private genderModel: Model<GenderDocument>,
        @InjectMapper() private readonly mapper: Mapper,
    ) {}

    async create(name: string) {
        try {
            const gender = await this.genderModel.create({
                name,
            });
            if (!gender)
                return handleResponse({
                    error: ERROR_CREATE_GENDER,
                    statusCode: HttpStatus.BAD_REQUEST,
                });

            return handleResponse({
                message: CREATE_GENDER_SUCCESSFULLY,
                data: gender,
            });
        } catch (error) {
            return handleResponse({
                error: ERROR_CREATE_GENDER,
                statusCode: HttpStatus.BAD_REQUEST,
            });
        }
    }

    async findAll() {
        try {
            const genders = await this.genderModel.find();
            return handleResponse({
                message: GET_GENDERS_SUCCESSFULLY,
                data: this.mapper.mapArray(genders, Gender as any, InfoDto),
            });
        } catch (error) {
            return handleResponse({
                error: ERROR_GET_GENDERS,
                statusCode: HttpStatus.BAD_REQUEST,
            });
        }
    }

    async findById(id: string) {
        return await this.genderModel.findById(id);
    }

    async update(genderId: string, name: string) {
        try {
            const updateGender = await this.genderModel.findOneAndUpdate(
                { _id: genderId },
                {
                    $set: {
                        name,
                    },
                },
                { new: true },
            );
            if (!updateGender)
                return handleResponse({
                    error: ERROR_UPDATE_GENDER,
                    statusCode: HttpStatus.BAD_REQUEST,
                });

            return handleResponse({
                message: UPDATE_GENDER_SUCCESSFULLY,
                data: updateGender,
            });
        } catch (error) {
            return handleResponse({
                error: ERROR_UPDATE_GENDER,
                statusCode: HttpStatus.BAD_REQUEST,
            });
        }
    }

    async delete(genderId: string) {
        try {
            await this.genderModel.deleteOne({ _id: genderId });
            return handleResponse({
                message: DELETE_GENDER_SUCCESSFULLY,
                data: genderId,
            });
        } catch (error) {
            return handleResponse({
                error: ERROR_DELETE_GENDER,
                statusCode: HttpStatus.BAD_REQUEST,
            });
        }
    }
}
