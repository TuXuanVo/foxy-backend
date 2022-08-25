import { Controller, Delete, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtGuard } from 'src/guards/jwt.guard';
import { NotificationService } from './notification.service';

@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Get()
    @ApiBearerAuth('access_token')
    @UseGuards(JwtGuard)
    async getAllByUser(@Req() req: Request) {
        return this.notificationService.getAllByUser((req.user as JWT_Info)._id);
    }

    @Patch(':id/seen')
    @ApiBearerAuth('access_token')
    @UseGuards(JwtGuard)
    async seen(@Req() req: Request, @Param('id') id: string) {
        return this.notificationService.updateSeen((req.user as JWT_Info)._id, id);
    }

    @Delete(':id')
    @ApiBearerAuth('access_token')
    @UseGuards(JwtGuard)
    async delete(@Req() req: Request, @Param('id') id: string) {
        return this.notificationService.delete((req.user as JWT_Info)._id, id);
    }
}
