import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthRegisterAdminDto } from 'src/dto';
import { UpdateAdminDto } from 'src/dto/request/Admin.dto';
import { Admin, AdminDocument } from 'src/schemas/admin.schema';

@Injectable()
export class AdminService {
    constructor(@InjectModel(Admin.name) private adminModel: Model<AdminDocument>) {}
    create(admin: AuthRegisterAdminDto): Promise<AdminDocument> {
        return this.adminModel.create(admin);
    }
    async findByIdWithValidate(_id: string): Promise<AdminDocument> {
        const result = await this.adminModel.findOne({ _id });
        if (!result) throw new NotFoundException('Admin not found');
        return result;
    }
    async findById(_id: string): Promise<AdminDocument> {
        return await this.adminModel.findOne({ _id });
    }
    async findByUsernameWithValidate(username: string): Promise<AdminDocument> {
        const result = await this.adminModel.findOne({ username });
        if (!result) throw new NotFoundException('Admin not found');
        return result;
    }
    async findByUsername(username: string): Promise<AdminDocument> {
        return await this.adminModel.findOne({ username });
    }
    async update(_id: string, admin: UpdateAdminDto): Promise<AdminDocument> {
        const result = await this.adminModel.findByIdAndUpdate({ _id }, admin, { new: true });
        if (!result) throw new NotFoundException('Admin not found');
        return result;
    }
}
