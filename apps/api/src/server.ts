import 'reflect-metadata';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import { env } from './config/env.js';
import { AppDataSource } from './data-source.js';

async function bootstrap() {
  const app = Fastify({
    logger: env.NODE_ENV === 'development' ? { transport: { target: 'pino-pretty' } } : true,
  });

  await app.register(cors, { origin: true });
  await app.register(sensible);

  app.get('/health', async () => ({
    status: 'ok',
    db: AppDataSource.isInitialized ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  }));

  try {
    await AppDataSource.initialize();
    app.log.info('Base de donnees connectee');
  } catch (err) {
    app.log.warn({ err }, 'Connexion DB impossible — l\'API demarre quand meme');
  }

  await app.listen({ port: env.PORT, host: '0.0.0.0' });
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
