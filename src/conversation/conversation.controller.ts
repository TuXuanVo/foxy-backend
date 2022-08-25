import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtGuard } from 'src/guards/jwt.guard';
import { ConversationService } from './conversation.service';

@Controller('conversation')
export class ConversationController {
    constructor(private readonly conversationService: ConversationService) {}
    @Get('')
    @ApiBearerAuth('access_token')
    @UseGuards(JwtGuard)
    async getAllConversationByUser(@Req() req: Request) {
        return this.conversationService.getAllConversationByUser((req.user as JWT_Info)._id);
    }

    @Get('/:id')
    @ApiBearerAuth('access_token')
    @UseGuards(JwtGuard)
    async getConversationById(
        @Req() req: Request,
        @Param('id') id: string,
        @Query('limit') limit: number,
        @Query('page') page: number,
    ) {
        return this.conversationService.getConversationById((req.user as JWT_Info)._id, id, limit, page);
    }
}
