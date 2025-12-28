import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { WalletModule } from './wallet/wallet.module';
import { SchemesModule } from './schemes/schemes.module';
import { BankAccountsModule } from './bank-accounts/bank-accounts.module';
import { CommunitiesModule } from './communities/communities.module';
import { AdminModule } from './admin/admin.module';
import { TransactionsModule } from './transactions/transactions.module';
import { IdGeneratorModule } from './id-generator/id-generator.module';
import { ProvidersModule } from './providers/providers.module';
import { InteractionsModule } from './interactions/interactions.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    CompaniesModule,
    WalletModule,
    SchemesModule,
    BankAccountsModule,
    CommunitiesModule,
    AdminModule,
    AdminModule,
    TransactionsModule,
    ProvidersModule,
    InteractionsModule,
    IdGeneratorModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
