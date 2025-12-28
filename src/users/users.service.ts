import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

import { IdGeneratorService } from '../id-generator/id-generator.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private idGenerator: IdGeneratorService
    ) { }

    async create(createUserDto: any): Promise<User> {
        // Generate NN-USR-YY-XXXXXX ID
        const nestId = await this.idGenerator.generateProfessionalId('USR');
        const createdUser = new this.userModel({ ...createUserDto, nestId });
        return createdUser.save();
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).select('+password').exec();
    }

    async findById(id: string): Promise<User | null> {
        return this.userModel.findById(id).exec();
    }

    async update(id: string, updateUserDto: any): Promise<User | null> {
        return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    }
}
