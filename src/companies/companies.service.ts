
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from '../schemas/company.schema';

import { IdGeneratorService } from '../id-generator/id-generator.service';

@Injectable()
export class CompaniesService {
    constructor(
        @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
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
            default: return 'PR'; // Generic Provider
        }
    }

    async create(createCompanyDto: any): Promise<Company> {
        const tag = this.getTagByCategory(createCompanyDto.category || createCompanyDto.community); // handling both field names just in case
        const nestId = await this.idGenerator.generateId('provider', tag);

        const createdCompany = new this.companyModel({ ...createCompanyDto, nestId });
        return createdCompany.save();
    }

    async findAllByUser(userId: string): Promise<Company[]> {
        return this.companyModel.find({ userId }).exec();
    }

    async findById(id: string): Promise<Company | null> {
        return this.companyModel.findById(id).exec();
    }

    async update(id: string, updateCompanyDto: any): Promise<Company | null> {
        return this.companyModel.findByIdAndUpdate(id, updateCompanyDto, { new: true }).exec();
    }

    async findAllPending(): Promise<Company[]> {
        return this.companyModel.find({ status: 'pending' }).exec();
    }
}
