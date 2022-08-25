import { Body, Controller, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { MessageCreateDto } from 'src/dto/request/Message.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { MessageService } from './message.service';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from 'src/utils/customValidation';

@ApiTags('Message')
@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}
    @Post()
    @ApiBearerAuth('access_token')
    @UseGuards(JwtGuard)
    @UseInterceptors(
        FilesInterceptor('images', 5, {
            fileFilter: imageFileFilter,
        }),
    )
    async create(
        @Req() req: Request,
        @Body() body: MessageCreateDto,
        @UploadedFiles() images: Array<Express.Multer.File>,
    ) {
        return await this.messageService.create((req.user as JWT_Info)._id, body, images);
    }
}
