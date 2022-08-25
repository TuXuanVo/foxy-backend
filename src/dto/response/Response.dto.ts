import { HttpException } from '@nestjs/common';

export function handleResponse({
    data,
    error,
    statusCode,
    message,
}: {
    data?: any;
    error?: string;
    message?: string;
    statusCode?: number;
}) {
    if (message)
        return {
            message,
            data,
        };
    throw new HttpException({ error, statusCode }, statusCode);
}
