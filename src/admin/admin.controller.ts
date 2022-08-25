import { Body, Controller, Delete, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { BeerService } from 'src/beer/beer.service';
import { UpdateAdminDto } from 'src/dto/request/Admin.dto';
import { CreateBeerDto, DeleteBeerDto, UpdateBeerDto } from 'src/dto/request/Beer.dto';
import { CreateGenderDto, DeleteGenderDto, UpdateGenderDto } from 'src/dto/request/Gender.dto';
import { EducationService } from 'src/education/education.service';
import { GenderService } from 'src/gender/gender.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { RolesGuard, UserRole } from 'src/guards/roles.guard';
import { Roles } from 'src/roles.decorator';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
        private readonly beerService: BeerService,
        private readonly genderService: GenderService,
        private readonly educationService: EducationService,
    ) {}

    @Post('/')
    @ApiBearerAuth('access_token')
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtGuard, RolesGuard)
    update(@Req() req: Request, @Body() body: UpdateAdminDto) {
        return this.adminService.update((req.user as JWT_Info)._id, body);
    }

    @Post('beer')
    @ApiBearerAuth('access_token')
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtGuard, RolesGuard)
    createBeer(@Body() body: CreateBeerDto) {
        return this.beerService.create(body.name);
    }

    @Put('beer')
    @ApiBearerAuth('access_token')
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtGuard, RolesGuard)
    updateBeer(@Body() body: UpdateBeerDto) {
        return this.beerService.update(body.id, body.name);
    }

    @Get('beer')
    @ApiBearerAuth('access_token')
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtGuard, RolesGuard)
    findAllBeer() {
        return this.beerService.findAll();
    }

    @Delete('beer')
    @ApiBearerAuth('access_token')
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtGuard, RolesGuard)
    deleteBeer(@Body() body: DeleteBeerDto) {
        return this.beerService.delete(body.id);
    }

    //Genders

    @Post('gender')
    @ApiBearerAuth('access_token')
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtGuard, RolesGuard)
    createGender(@Body() body: CreateGenderDto) {
        return this.genderService.create(body.name);
    }

    @Put('gender')
    @ApiBearerAuth('access_token')
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtGuard, RolesGuard)
    updateGender(@Body() body: UpdateGenderDto) {
        return this.genderService.update(body.id, body.name);
    }

    @Get('gender')
    @ApiBearerAuth('access_token')
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtGuard, RolesGuard)
    findAllGender() {
        return this.genderService.findAll();
    }

    @Delete('gender')
    @ApiBearerAuth('access_token')
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtGuard, RolesGuard)
    deleteGender(@Body() body: DeleteGenderDto) {
        return this.genderService.delete(body.id);
    }

    //Education

    @Post('education')
    @ApiBearerAuth('access_token')
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtGuard, RolesGuard)
    createEducation(@Body() body: CreateGenderDto) {
        return this.educationService.create(body.name);
    }

    @Put('education')
    @ApiBearerAuth('access_token')
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtGuard, RolesGuard)
    updateEducation(@Body() body: UpdateGenderDto) {
        return this.educationService.update(body.id, body.name);
    }

    @Get('education')
    @ApiBearerAuth('access_token')
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtGuard, RolesGuard)
    findAllEducation() {
        return this.educationService.findAll();
    }

    @Delete('education')
    @ApiBearerAuth('access_token')
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtGuard, RolesGuard)
    deleteEducation(@Body() body: DeleteGenderDto) {
        return this.educationService.delete(body.id);
    }
}
