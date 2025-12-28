
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Counter, CounterDocument } from '../schemas/counter.schema';

@Injectable()
export class IdGeneratorService {
    constructor(
        @InjectModel(Counter.name) private counterModel: Model<CounterDocument>,
    ) { }

    // Logic: NN-TAG-YY-SEQUENCE (e.g. NN-LAB-25-000123)
    async generateProfessionalId(tag: string): Promise<string> {
        // Tag should be 3 letters, e.g., 'USR', 'LAB'
        const upperTag = tag.toUpperCase();
        const yearFull = new Date().getFullYear();
        const yearShort = yearFull.toString().slice(-2); // "25" for 2025

        // Key to track sequence: e.g. 'seq_LAB_2025' to reset or continue per year/tag?
        // Usually sequence is global or per tag. The image implies "000123" is unique number.
        // Let's assume unique sequence per TAG.
        const sequenceKey = `professional_${upperTag}`;

        const counter = await this.counterModel.findByIdAndUpdate(
            sequenceKey,
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        const sequence = counter.seq.toString().padStart(6, '0');

        // NN-TAG-YY-SEQ
        return `NN-${upperTag}-${yearShort}-${sequence}`;
    }

    // Keeping legacy/simple methods just in case, or for other entities if needed.
    // ...
}
