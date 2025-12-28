
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Interaction, InteractionDocument, InteractionStatus } from '../schemas/interaction.schema';

@Injectable()
export class InteractionsService {
    constructor(@InjectModel(Interaction.name) private interactionModel: Model<InteractionDocument>) { }

    async create(createInteractionDto: any): Promise<Interaction> {
        const createdInteraction = new this.interactionModel(createInteractionDto);
        return createdInteraction.save();
    }

    async findByCustomer(customerId: string): Promise<Interaction[]> {
        return this.interactionModel.find({ customerId }).populate('providerId').sort({ createdAt: -1 }).exec();
    }

    async findByProvider(providerId: string): Promise<Interaction[]> {
        return this.interactionModel.find({ providerId }).populate('customerId').sort({ createdAt: -1 }).exec();
    }

    async findById(id: string): Promise<Interaction> {
        const interaction = await this.interactionModel.findById(id).populate(['customerId', 'providerId']).exec();
        if (!interaction) {
            throw new NotFoundException(`Interaction with ID ${id} not found`);
        }
        return interaction;
    }

    async updateStatus(id: string, status: InteractionStatus): Promise<Interaction> {
        const updated = await this.interactionModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
        if (!updated) {
            throw new NotFoundException(`Interaction with ID ${id} not found`);
        }
        return updated;
    }

    async completeInteraction(id: string, data: { rating?: number, review?: string, agreedAmount?: number }): Promise<Interaction> {
        const updated = await this.interactionModel.findByIdAndUpdate(id, {
            status: InteractionStatus.COMPLETED,
            completionTime: new Date(),
            ...data
        }, { new: true }).exec();
        if (!updated) {
            throw new NotFoundException(`Interaction with ID ${id} not found`);
        }
        return updated;
    }
}
