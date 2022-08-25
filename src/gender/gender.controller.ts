import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GenderService } from './gender.service';

@ApiTags('Gender')
@Controller('gender')
export class GenderController {
    constructor(private readonly genderService: GenderService) {}

    @Get()
    async findAll() {
        return this.genderService.findAll();
    }
}
