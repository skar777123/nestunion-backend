
import { Controller, Get, Post, Body, Param, Put, UseGuards, Request } from '@nestjs/common';
import { InteractionsService } from './interactions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InteractionStatus } from '../schemas/interaction.schema';

@Controller('interactions')
@UseGuards(JwtAuthGuard)
export class InteractionsController {
    constructor(private readonly interactionsService: InteractionsService) { }

    @Post()
    async create(@Request() req, @Body() createInteractionDto: any) {
        createInteractionDto.customerId = req.user.userId || req.user.sub;
        return this.interactionsService.create(createInteractionDto);
    }

    @Get('customer/history')
    async getCustomerHistory(@Request() req) {
        return this.interactionsService.findByCustomer(req.user.userId || req.user.sub);
    }

    // Note: This requires the user to have a provider profile linked
    @Get('provider/requests/:providerId')
    async getProviderRequests(@Param('providerId') providerId: string) {
        // In a real app, verify the user owns this providerId
        return this.interactionsService.findByProvider(providerId);
    }

    @Put(':id/status')
    async updateStatus(@Param('id') id: string, @Body('status') status: InteractionStatus) {
        return this.interactionsService.updateStatus(id, status);
    }

    @Put(':id/complete')
    async complete(@Param('id') id: string, @Body() body: any) {
        return this.interactionsService.completeInteraction(id, body);
    }
}
