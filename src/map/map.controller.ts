import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { LocationDto } from 'src/dto/request/Map.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { MapService } from './map.service';

@ApiTags('Map')
@Controller('map')
export class MapController {
    constructor(private readonly mapService: MapService) {}

    @Put()
    @ApiBearerAuth('access_token')
    @UseGuards(JwtGuard)
    async updateLocation(@Req() req: Request, @Body() location: LocationDto) {
        return this.mapService.updateLocation((req.user as JWT_Info)._id, location);
    }

    @Get()
    @ApiBearerAuth('access_token')
    @UseGuards(JwtGuard)
    async findFriendsAround(@Req() req: Request) {
        return await this.mapService.findFriendAround((req.user as JWT_Info)._id);
    }
}
