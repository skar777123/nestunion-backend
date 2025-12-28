
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Counter, CounterDocument } from '../schemas/counter.schema';

@Injectable()
export class IdGeneratorService {
    constructor(
        @InjectModel(Counter.name) private counterModel: Model<CounterDocument>,
    ) { }

    async generateId(prefix: string, tag: string): Promise<string> {
        const sequenceName = `${prefix}_${tag}`.toLowerCase();

        // Find and update the counter for this specific sequence
        const counter = await this.counterModel.findByIdAndUpdate(
            sequenceName,
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        const year = new Date().getFullYear();
        const sequence = counter.seq.toString().padStart(4, '0');

        // Format: NEST + YEAR + TAG + SEQ (e.g., NEST2025U0001)
        return `NEST${year}${tag}${sequence}`;
    }

    // New simpler format for Users if preferred: NEST + 6 digits
    // e.g., NEST000001, NEST000002
    async generateSimpleId(key: string): Promise<string> {
        const counter = await this.counterModel.findByIdAndUpdate(
            key, // e.g. 'user_global'
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        const sequence = counter.seq.toString().padStart(6, '0');
        return `NEST${sequence}`;
    }
}
