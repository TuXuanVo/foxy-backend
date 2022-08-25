import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { MongoServerError } from 'mongodb';
import { capitalizeFirstLetter } from './utils/handleError';

@Catch(MongoServerError)
export class MongoExceptionFilter implements ExceptionFilter {
    catch(exception: MongoServerError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const STATUS_CODE = HttpStatus.CONFLICT;
        let message: string[] | string | undefined = exception.message || undefined;
        if (exception.kind == 'ObjectId') {
            message = 'Id input is not valid';
        }
        if (exception.code == 11000) {
            message = '';
            for (const p in exception.keyValue) {
                message = `${capitalizeFirstLetter(p)} is exist!`;
            }
        }
        if (exception.errors) {
            exception.statusCode = 400;
            message = [];
            for (const p in exception.errors) {
                message.push(exception.errors[p].properties.message);
            }
        }
        return response.status(STATUS_CODE).json({
            path: `${request.url}`,
            statusCode: STATUS_CODE,
            message,
        });
    }
}
