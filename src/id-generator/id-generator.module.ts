
import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Counter, CounterSchema } from '../schemas/counter.schema';
import { IdGeneratorService } from './id-generator.service';

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([{ name: Counter.name, schema: CounterSchema }]),
    ],
    providers: [IdGeneratorService],
    exports: [IdGeneratorService],
})
export class IdGeneratorModule { }
