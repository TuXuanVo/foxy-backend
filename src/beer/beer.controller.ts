import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BeerService } from './beer.service';

@ApiTags('Beer')
@Controller('beer')
export class BeerController {
    constructor(private readonly beerService: BeerService) {}

    @Get()
    async findAllBeers() {
        return await this.beerService.findAll();
    }
}
