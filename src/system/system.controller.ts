import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SettingDto, UpdateSettingDto } from 'src/dto/request/System.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { RolesGuard, UserRole } from 'src/guards/roles.guard';
import { Roles } from 'src/roles.decorator';
import { SystemService } from './system.service';

@ApiTags('System')
@Controller('system')
export class SystemController {
    constructor(private readonly systemService: SystemService) {}

    @Get()
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtGuard, RolesGuard)
    @ApiBearerAuth('access_token')
    async findAll() {
        return this.systemService.findAll();
    }

    @Post()
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtGuard, RolesGuard)
    @ApiBearerAuth('access_token')
    async create(@Body() systemSetting: SettingDto) {
        return await this.systemService.create(systemSetting);
    }

    @Put(':id')
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtGuard, RolesGuard)
    @ApiBearerAuth('access_token')
    async update(@Body() systemSetting: UpdateSettingDto, @Param('id') id: string) {
        return await this.systemService.update(id, systemSetting.value);
    }
}
