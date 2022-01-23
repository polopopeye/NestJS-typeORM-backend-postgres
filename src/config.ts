import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    database: {
      name: process.env.DATABASE_NAME,
      port: process.env.DATABASE_PORT,
    },
    postgres: {
      engine: process.env.DATABASE_ENGINE.trim(),
      dbName: process.env.POSTGRESS_DB,
      user: process.env.POSTGRESS_USER,
      password: process.env.POSTGRESS_PASSWORD,
      port: parseInt(process.env.POSTGRESS_PORT),
      host: process.env.POSTGRESS_HOST,
    },
    apiKey: process.env.API_KEY,
  };
});
