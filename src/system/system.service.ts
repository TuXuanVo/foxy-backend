import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { System, SystemDocument } from 'src/schemas/system.schema';

@Injectable()
export class SystemService {
    constructor(@InjectModel(System.name) private systemModel: Model<SystemDocument>) {}

    async findAll() {
        return {
            message: 'Find all system setting successfully',
            data: {
                sysSettings: await this.systemModel.find(),
            },
        };
    }

    async create(setting: ICreateSetting) {
        try {
            return {
                message: 'Create system setting successfully',
                data: {
                    setting: await this.systemModel.create({
                        name: setting.name,
                        value: setting.value,
                    }),
                },
            };
        } catch (error) {
            throw new BadRequestException('Has an error when creating system setting.');
        }
    }

    async update(settingId: string, value: number | string | boolean) {
        try {
            const sysSetting = await this.systemModel.findOneAndUpdate(
                { _id: settingId },
                {
                    value: value,
                },
                { new: true },
            );

            return {
                message: 'Update system setting successfully',
                data: {
                    setting: sysSetting,
                },
            };
        } catch (error) {
            throw new BadRequestException('Has an error when updating system setting.');
        }
    }

    async findByNameWithValidate(name: string) {
        const setting = await this.systemModel.findOne({ name: name });
        if (!setting) {
            throw new NotFoundException('Setting not found.');
        }
        return setting;
    }
}
