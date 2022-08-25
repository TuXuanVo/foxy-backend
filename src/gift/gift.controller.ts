import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { BuyGiftDto, ExchangeGiftDto, GiftDto, SendGiftDto } from 'src/dto/request/Gift.dto';
import { Request } from 'express';
import { JwtGuard } from 'src/guards/jwt.guard';
import { RolesGuard, UserRole } from 'src/guards/roles.guard';
import { Roles } from 'src/roles.decorator';
import { GiftService } from './gift.service';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Gift')
@Controller('gift')
export class GiftController {
    constructor(private readonly giftService: GiftService) {}

    @Get()
    async getList() {
        return await this.giftService.findAll();
    }

    @Post('/')
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtGuard, RolesGuard)
    @ApiBearerAuth('access_token')
    async create(@Body() body: GiftDto) {
        return await this.giftService.create(body);
    }

    @Roles(UserRole.ADMIN)
    @UseGuards(JwtGuard, RolesGuard)
    @ApiBearerAuth('access_token')
    @Put(':id')
    @ApiParam({ name: 'id', type: String })
    async update(@Body() body: GiftDto, @Param('id') id: string) {
        return await this.giftService.update(id, body);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtGuard, RolesGuard)
    @ApiBearerAuth('access_token')
    @ApiParam({ name: 'id', type: String })
    async delete(@Param('id') id: string) {
        return await this.giftService.delete(id);
    }

    @Post('buy')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('access_token')
    async buy(@Req() req: Request, @Body() body: BuyGiftDto) {
        return await this.giftService.buy((req.user as JWT_Info)._id, body);
    }

    @Post('send')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('access_token')
    async send(@Req() req: Request, @Body() body: SendGiftDto) {
        return await this.giftService.send((req.user as JWT_Info)._id, body);
    }

    @Post('exchange')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('access_token')
    async exchange(@Req() req: Request, @Body() body: ExchangeGiftDto) {
        return await this.giftService.exchange((req.user as JWT_Info)._id, body.giftId, body.quantity);
    }
}
