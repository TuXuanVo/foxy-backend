import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    CREATE_EDUCATION_SUCCESSFULLY,
    DELETE_EDUCATION_SUCCESSFULLY,
    ERROR_CREATE_EDUCATION,
    ERROR_DELETE_EDUCATION,
    ERROR_GET_EDUCATIONS,
    ERROR_UPDATE_EDUCATION,
    GET_EDUCATIONS_SUCCESSFULLY,
    UPDATE_EDUCATION_SUCCESSFULLY,
} from 'src/constance/responseCode';
import { InfoDto } from 'src/dto/response/Auth.dto';
import { handleResponse } from 'src/dto/response/Response.dto';
import { Education, EducationDocument } from 'src/schemas/education.schema';

@Injectable()
export class EducationService {
    constructor(
        @InjectModel(Education.name) private educationModel: Model<EducationDocument>,
        @InjectMapper() private readonly mapper: Mapper,
    ) {}

    async create(name: string) {
        try {
            const education = await this.educationModel.create({
                name,
            });
            if (!education)
                return handleResponse({
                    error: ERROR_CREATE_EDUCATION,
                    statusCode: HttpStatus.BAD_REQUEST,
                });

            return handleResponse({
                message: CREATE_EDUCATION_SUCCESSFULLY,
                data: education,
            });
        } catch (error) {}
    }

    async findAll() {
        try {
            const educations = await this.educationModel.find();
            return handleResponse({
                message: GET_EDUCATIONS_SUCCESSFULLY,
                data: this.mapper.mapArray(educations, Education as any, InfoDto),
            });
        } catch (error) {
            return handleResponse({
                error: ERROR_GET_EDUCATIONS,
                statusCode: HttpStatus.BAD_REQUEST,
            });
        }
    }

    async findById(id: string) {
        return await this.educationModel.findById(id);
    }

    async update(educationId: string, name: string) {
        try {
            const updatedEducation = await this.educationModel.findOneAndUpdate(
                { _id: educationId },
                {
                    $set: {
                        name,
                    },
                },
                { new: true },
            );
            if (!updatedEducation)
                return handleResponse({
                    error: ERROR_UPDATE_EDUCATION,
                    statusCode: HttpStatus.BAD_REQUEST,
                });

            return handleResponse({
                message: UPDATE_EDUCATION_SUCCESSFULLY,
                data: updatedEducation,
            });
        } catch (error) {
            return handleResponse({
                error: ERROR_UPDATE_EDUCATION,
                statusCode: HttpStatus.BAD_REQUEST,
            });
        }
    }

    async delete(educationId: string) {
        try {
            await this.educationModel.deleteOne({ _id: educationId });
            return handleResponse({
                message: DELETE_EDUCATION_SUCCESSFULLY,
                data: educationId,
            });
        } catch (error) {
            return handleResponse({
                error: ERROR_DELETE_EDUCATION,
                statusCode: HttpStatus.BAD_REQUEST,
            });
        }
    }
}
