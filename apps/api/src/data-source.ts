import { DataSource } from 'typeorm';
import { env } from './config/env.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  username: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
  synchronize: env.NODE_ENV === 'development',
  logging: env.NODE_ENV === 'development',
  entities:
    env.NODE_ENV === 'production'
      ? ['dist/modules/**/*.entity.js']
      : ['src/modules/**/*.entity.ts'],
  migrations: env.NODE_ENV === 'production' ? ['dist/migrations/*.js'] : ['src/migrations/*.ts'],
  subscribers: [],
});
