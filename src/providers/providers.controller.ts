
import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('providers')
export class ProvidersController {
    constructor(private readonly providersService: ProvidersService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Request() req, @Body() createProviderDto: any) {
        // Automatically link to the logged-in user
        createProviderDto.userId = req.user.userId || req.user.sub;
        return this.providersService.create(createProviderDto);
    }

    @Get()
    async findAll(@Query('lat') lat: number, @Query('lng') lng: number, @Query('category') category: string) {
        if (lat && lng) {
            return this.providersService.findNearby(Number(lat), Number(lng), 5000, category);
        }
        return this.providersService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.providersService.findById(id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id') id: string, @Body() updateProviderDto: any) {
        return this.providersService.update(id, updateProviderDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id') id: string) {
        return this.providersService.remove(id);
    }
}
