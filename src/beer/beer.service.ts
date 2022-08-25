import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    CREATE_BEER_SUCCESSFULLY,
    DELETE_BEER_SUCCESSFULLY,
    ERROR_CREATE_BEER,
    ERROR_DELETE_BEERS,
    ERROR_GET_BEERS,
    ERROR_UPDATE_BEER,
    GET_BEERS_SUCCESSFULLY,
    UPDATE_BEER_SUCCESSFULLY,
} from 'src/constance/responseCode';
import { InfoDto } from 'src/dto/response/Auth.dto';
import { handleResponse } from 'src/dto/response/Response.dto';
import { Beer, BeerDocument } from 'src/schemas/beer.schema';

@Injectable()
export class BeerService {
    constructor(
        @InjectModel(Beer.name) private beerModel: Model<BeerDocument>,
        @InjectMapper() private readonly mapper: Mapper,
    ) {}

    async create(name: string) {
        try {
            const beer = await this.beerModel.create({
                name,
            });
            if (!beer)
                return handleResponse({
                    error: ERROR_CREATE_BEER,
                    statusCode: HttpStatus.BAD_REQUEST,
                });

            return handleResponse({
                message: CREATE_BEER_SUCCESSFULLY,
                data: beer,
            });
        } catch (error) {
            return handleResponse({
                error: ERROR_CREATE_BEER,
                statusCode: HttpStatus.BAD_REQUEST,
            });
        }
    }

    async findAll() {
        try {
            const beers = await this.beerModel.find();

            return handleResponse({
                message: GET_BEERS_SUCCESSFULLY,
                data: this.mapper.mapArray(beers, Beer as any, InfoDto),
            });
        } catch (error) {
            return handleResponse({
                error: ERROR_GET_BEERS,
                statusCode: HttpStatus.BAD_REQUEST,
            });
        }
    }

    async findById(id: string) {
        return await this.beerModel.findById(id);
    }

    async update(beerId: string, name: string) {
        try {
            const updateBeer = await this.beerModel.findOneAndUpdate(
                { _id: beerId },
                {
                    $set: {
                        name,
                    },
                },
                { new: true },
            );
            if (!updateBeer)
                return handleResponse({
                    error: ERROR_UPDATE_BEER,
                    statusCode: HttpStatus.BAD_REQUEST,
                });

            return handleResponse({
                message: UPDATE_BEER_SUCCESSFULLY,
                data: updateBeer,
            });
        } catch (error) {
            return handleResponse({
                error: ERROR_UPDATE_BEER,
                statusCode: HttpStatus.BAD_REQUEST,
            });
        }
    }

    async delete(beerId: string) {
        try {
            await this.beerModel.deleteOne({ _id: beerId });
            return handleResponse({
                message: DELETE_BEER_SUCCESSFULLY,
                data: beerId,
            });
        } catch (error) {
            return handleResponse({
                error: ERROR_DELETE_BEERS,
                statusCode: HttpStatus.BAD_REQUEST,
            });
        }
    }
}
