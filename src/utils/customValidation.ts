import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'number-or-string-or-boolean', async: false })
export class IsNumberOrStringOrBoolean implements ValidatorConstraintInterface {
    validate(value: any, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
        return typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean';
    }
    defaultMessage?(validationArguments?: ValidationArguments): string {
        return '($value) must be number or string or boolean';
    }
}

export const imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return callback(new HttpException('Only image files are allowed!', HttpStatus.BAD_REQUEST), false);
    }
    callback(null, true);
};
