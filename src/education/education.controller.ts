import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EducationService } from './education.service';

@ApiTags('Education')
@Controller('education')
export class EducationController {
    constructor(private readonly educationService: EducationService) {}

    @Get()
    async findAllEducations() {
        return await this.educationService.findAll();
    }
}
