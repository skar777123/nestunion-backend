
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Provider, ProviderDocument } from '../schemas/provider.schema';
import { IdGeneratorService } from '../id-generator/id-generator.service';

@Injectable()
export class ProvidersService {
    constructor(
        @InjectModel(Provider.name) private providerModel: Model<ProviderDocument>,
        private idGenerator: IdGeneratorService
    ) { }

    private getTagByCategory(category: string): string {
        switch (category) {
            case 'Auto / Taxi': return 'AT';
            case 'Dukandar': return 'DK';
            case 'Labour': return 'LB';
            case 'Delivery': return 'DL';
            case 'Farmer': return 'FR';
            case 'Electrician / Plumber': return 'EP';
            default: return 'PR';
        }
    }

    async create(createProviderDto: any): Promise<Provider> {
        const tag = this.getTagByCategory(createProviderDto.category);
        const nestId = await this.idGenerator.generateId('provider', tag);

        const createdProvider = new this.providerModel({ ...createProviderDto, nestId });
        return createdProvider.save();
    }

    async findAll(): Promise<Provider[]> {
        return this.providerModel.find().exec();
    }

    async findById(id: string): Promise<Provider> {
        const provider = await this.providerModel.findById(id).exec();
        if (!provider) {
            throw new NotFoundException(`Provider with ID ${id} not found`);
        }
        return provider;
    }

    async findByUserId(userId: string): Promise<Provider | null> {
        return this.providerModel.findOne({ userId }).exec();
    }

    async findByNestId(nestId: string): Promise<Provider | null> {
        return this.providerModel.findOne({ nestId }).exec();
    }

    async update(id: string, updateProviderDto: any): Promise<Provider> {
        const updated = await this.providerModel.findByIdAndUpdate(id, updateProviderDto, { new: true }).exec();
        if (!updated) {
            throw new NotFoundException(`Provider with ID ${id} not found`);
        }
        return updated;
    }

    async remove(id: string): Promise<void> {
        const result = await this.providerModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Provider with ID ${id} not found`);
        }
    }

    // Geospatial Search
    async findNearby(lat: number, lng: number, maxDistance: number = 5000, category?: string): Promise<Provider[]> {
        const query: any = {
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [lng, lat],
                    },
                    $maxDistance: maxDistance,
                },
            },
            isAvailable: true,
        };

        if (category) {
            query.category = category;
        }

        return this.providerModel.find(query).exec();
    }
}
