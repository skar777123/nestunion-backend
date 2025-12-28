
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';
import { Provider, ProviderSchema } from '../schemas/provider.schema';
import { IdGeneratorModule } from '../id-generator/id-generator.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Provider.name, schema: ProviderSchema }]),
        IdGeneratorModule
    ],
    controllers: [ProvidersController],
    providers: [ProvidersService],
    exports: [ProvidersService],
})
export class ProvidersModule { }
