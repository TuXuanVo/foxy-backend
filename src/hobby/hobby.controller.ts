import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateHobbyDto, UpdateHobbyDto } from 'src/dto/request/Hobby.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { HobbyService } from './hobby.service';

@ApiTags('Hobby')
@Controller('hobby')
export class HobbyController {
    constructor(private readonly hobbyService: HobbyService) {}

    @Post()
    @ApiBearerAuth('access_token')
    @UseGuards(JwtGuard)
    create(@Body() body: CreateHobbyDto) {
        return this.hobbyService.create(body.name);
    }

    @Get()
    @ApiBearerAuth('access_token')
    @UseGuards(JwtGuard)
    findAll() {
        return this.hobbyService.findAll();
    }

    @Patch(':id')
    @ApiBearerAuth('access_token')
    @UseGuards(JwtGuard)
    updateHobbyById(@Param('id') id: string, @Body() body: UpdateHobbyDto) {
        return this.hobbyService.updateHobbyById(id, body);
    }

    @Delete(':id')
    @ApiBearerAuth('access_token')
    @UseGuards(JwtGuard)
    remove(@Param('id') id: string) {
        return this.hobbyService.remove(id);
    }
}
