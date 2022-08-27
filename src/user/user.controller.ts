import {
    Body,
    Controller,
    Patch,
    Post,
    Put,
    Req,
    UseGuards,
    Get,
    Delete,
    UseInterceptors,
    UploadedFiles,
    UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { JwtGuard } from 'src/guards/jwt.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
    BioDto,
    CommonInfoDto,
    IdDto,
    ImageDto,
    LikeUserDto,
    ReasonDto,
    ReligionDto,
    UserFirstUpdateDto,
    HeightDto,
} from 'src/dto';
import { HobbyDto } from 'src/dto/request/Hobby.dto';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from 'src/utils/customValidation';
import { Express } from 'express';
import 'dotenv/config';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('like')
    @ApiBearerAuth('access_token')
    @UseGuards(JwtGuard)
    async like(@Req() req: Request, @Body() body: LikeUserDto) {
        return this.userService.like((req.user as JWT_Info)._id, body.userId);
    }

    @Post('unlike')
    @ApiBearerAuth('access_token')
    @UseGuards(JwtGuard)
    async unlike(@Req() req: Request, @Body() body: LikeUserDto) {
        return this.userService.unlike((req.user as JWT_Info)._id, body.userId);
    }

    @Post('block')
    @ApiBearerAuth('access_token')
    @UseGuards(JwtGuard)
    async block(@Req() req: Request, @Body() body: LikeUserDto) {
        return this.userService.block((req.user as JWT_Info)._id, body.userId);
    }

    @Post('unblock')
    @ApiBearerAuth('access_token')
    @UseGuards(JwtGuard)
    async unblock(@Req() req: Request, @Body() body: LikeUserDto) {
        return this.userService.unblock((req.user as JWT_Info)._id, body.userId);
    }

    @Put('first-update-profile')
    @ApiBearerAuth('access_token')
    @UseGuards(JwtGuard)
    async updateInfoFirstRegister(@Req() req: Request, @Body() body: UserFirstUpdateDto) {
        return this.userService.updateInfoFirstRegister((req.user as JWT_Info)._id, body);
    }

    @Get('strange-friends')
    @ApiBearerAuth('access_token')
    @UseGuards(JwtGuard)
    async findStrangeFriends(@Req() req: Request) {
        return this.userService.findStrangeFriendsAround((req.user as JWT_Info)._id);
    }

    @Patch('hobby')
    @ApiBearerAuth('access_token')
    @UseGuards(JwtGuard)
    async addHobby(@Req() req: Request, @Body() body: HobbyDto) {
        return await this.userService.addHobbies((req.user as JWT_Info)._id, body.hobbies);
    }

    @Delete('hobby')
    @ApiBearerAuth('access_token')
    @UseGuards(JwtGuard)
    async deletehobby(@Req() req: Request, @Body() body: HobbyDto) {
        return await this.userService.deleteHobbies((req.user as JWT_Info)._id, body.hobbies);
    }

    @Put('beer')
    @ApiBearerAuth('access_token')
    @UseGuards(JwtGuard)
    async updateBeer(@Req() req: Request, @Body() body: IdDto) {
        return await this.userService.updateBeer((req.user as JWT_Info)._id, body.id);
    }

    @Put('education')
    @ApiBearerAuth('access_token')
    @UseGuards(JwtGuard)
    async updateEducation(@Req() req: Request, @Body() body: IdDto) {
        return await this.userService.updateEducation((req.user as JWT_Info)._id, body.id);
    }

    @Put('religion')
    @ApiBearerAuth('access_token')
    @UseGuards(JwtGuard)
    async updateReligion(@Req() req: Request, @Body() body: ReligionDto) {
        return await this.userService.updateReligion((req.user as JWT_Info)._id, body.religion);
    }

    @Put('gender')
    @ApiBearerAuth('access_token')
    @UseGuards(JwtGuard)
    async updateGender(@Req() req: Request, @Body() body: IdDto) {
        return await this.userService.updateGender((req.user as JWT_Info)._id, body.id);
    }

    @Post('albums')
    @ApiBearerAuth('access_token')
    @UseGuards(JwtGuard)
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                albums: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                },
            },
        },
    })
    @UseInterceptors(
        FilesInterceptor('albums', 10, {
            fileFilter: imageFileFilter,
        }),
    )
    async uploadAlbums(@Req() req: Request, @UploadedFiles() albums: Array<Express.Multer.File>) {
        return this.userService.uploadAlbums((req.user as JWT_Info)._id, albums);
    }

    @Put('bio')
    @ApiBearerAuth('access_token')
    @UseGuards(JwtGuard)
    async updateBio(@Req() req: Request, @Body() body: BioDto) {
        return this.userService.updateBio((req.user as JWT_Info)._id, body.bio);
    }

    @Put('reason')
    @ApiBearerAuth('access_token')
    @UseGuards(JwtGuard)
    async updateReason(@Req() req: Request, @Body() body: ReasonDto) {
        return this.userService.updateReason((req.user as JWT_Info)._id, body.reason);
    }

    @Put('common-info')
    @ApiBearerAuth('access_token')
    @UseGuards(JwtGuard)
    @UseInterceptors(FileInterceptor('avatar'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                birthday: {
                    type: 'string',
                    format: 'date-time',
                },
                avatar: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    async updateCommonInfo(
        @Req() req: Request,
        @UploadedFile() avatar: Express.Multer.File,
        @Body() body: CommonInfoDto,
    ) {
        return await this.userService.updateCommonInfo((req.user as JWT_Info)._id, avatar, body);
    }

    @Put('update-favorite-image')
    @ApiBearerAuth('access_token')
    @UseGuards(JwtGuard)
    async updateFavoriteImage(@Req() req: Request, @Body() body: ImageDto) {
        return await this.userService.updateFavoriteImage((req.user as JWT_Info)._id, body.url);
    }

    @Put('update-default-image')
    @ApiBearerAuth('access_token')
    @UseGuards(JwtGuard)
    async updateDefaultImage(@Req() req: Request, @Body() body: ImageDto) {
        return await this.userService.updateDefaultImage((req.user as JWT_Info)._id, body.url);
    }

    @Delete('delete-image')
    @ApiBearerAuth('access_token')
    @UseGuards(JwtGuard)
    async deleteImage(@Req() req: Request, @Body() body: ImageDto) {
        return await this.userService.deleteImage((req.user as JWT_Info)._id, body.url);
    }

    @Put('update-height')
    @ApiBearerAuth('access_token')
    @UseGuards(JwtGuard)
    async updateHeight(@Req() req: Request, @Body() body: HeightDto) {
        return await this.userService.updateHeight((req.user as JWT_Info)._id, body.height);
    }

    @Get('friends')
    @ApiBearerAuth('access_token')
    @UseGuards(JwtGuard)
    async getFriends(@Req() req: Request) {
        return await this.userService.getFriends((req.user as JWT_Info)._id);
    }
}
