/* eslint-disable prettier/prettier */

import { ConfigService, ConfigType } from '@nestjs/config';
import config from 'src/config';
import { createConnection } from 'typeorm';

// const dbParams = (configService) => {
//   console.log(configService);
//   const {
//     user: username,
//     host,
//     password,
//     port,
//     dbName: database,
//   } = configService.postgres;

//   return {
//     type: 'postgres',
//     username,
//     host,
//     password,
//     port,
//     database,
//   };
// };

// export const databaseProviders = [
//   {
//     provide: 'DATABASE_CONNECTION',
//     useFactory: async () => {
//       const data = dbParams();
//       return createConnection({
//         type: data.type,
//         username: data.username,
//         host: data.host,
//         password: data.password,
//         port: data.port,
//         database: data.database,
//         entities: [__dirname + '/../**/*.entity{.ts,.js}'],
//         synchronize: true,
//       });
//     },
//     inject: [config.KEY],
//   },
// ];

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (configuration: ConfigType<typeof config> = config()) => {
      const {
        engine,
        dbName: database,
        user: username,
        password,
        port,
        host,
      } = configuration.postgres;

      console.log(engine, database, username, password, port, host);

      const connection = await createConnection({
        type: 'postgres',
        host,
        port,
        username,
        password,
        database,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      });
      return connection;
    },
  },
];
