import { Module, Global } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { Client } from 'pg';
import config from 'src/config';
import { databaseProviders } from './database.providers';

const API_KEY = '12345634';
const API_KEY_PROD = 'PROD1212121SA';

@Global()
@Module({
  providers: [
    ...databaseProviders,
    {
      provide: 'API_KEY',
      useValue: process.env.NODE_ENV === 'prod' ? API_KEY_PROD : API_KEY,
    },
    {
      provide: 'PG',
      useFactory: (configService: ConfigType<typeof config>) => {
        const {
          user,
          host,
          password,
          port,
          dbName: database,
        } = configService.postgres;
        const client = new Client({
          user,
          host,
          database,
          password,
          port,
        });
        client.connect();
        return client;
      },
      inject: [config.KEY],
    },
  ],
  exports: ['API_KEY', 'PG', ...databaseProviders],
})
export class DatabaseModule {}
