import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const fastify = Fastify({
  logger: true,
});

let prisma: PrismaClient | null = null;
try {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });
} catch (e) {
  fastify.log.warn('Prisma client not connected to PostgreSQL: ' + (e as Error).message);
}

fastify.register(cors, {
  origin: true,
});

// Basic health check route
fastify.get('/api/health', async (request, reply) => {
  return {
    status: 'ok',
    message: 'Khajiit API is running',
    timestamp: new Date().toISOString(),
    postgresConnected: prisma !== null,
  };
});

// Pre-populated Device Catalog Autocomplete Endpoint
fastify.get('/api/catalog/devices', async (request, reply) => {
  return [
    {
      id: 'dev-1',
      brand: 'Apple',
      model: 'iPhone 15 Pro',
      ramOptions: ['8GB'],
      storageOptions: ['128GB', '256GB', '512GB', '1TB'],
      launchMsrp: 134900,
      referenceUsedMin: 85000,
      referenceUsedMax: 95000,
    },
    {
      id: 'dev-2',
      brand: 'Apple',
      model: 'iPhone 14',
      ramOptions: ['6GB'],
      storageOptions: ['128GB', '256GB', '512GB'],
      launchMsrp: 79900,
      referenceUsedMin: 45000,
      referenceUsedMax: 52000,
    },
    {
      id: 'dev-3',
      brand: 'Samsung',
      model: 'Galaxy S24 Ultra',
      ramOptions: ['12GB'],
      storageOptions: ['256GB', '512GB', '1TB'],
      launchMsrp: 129999,
      referenceUsedMin: 88000,
      referenceUsedMax: 98000,
    },
    {
      id: 'dev-4',
      brand: 'OnePlus',
      model: 'OnePlus 12',
      ramOptions: ['12GB', '16GB'],
      storageOptions: ['256GB', '512GB'],
      launchMsrp: 64999,
      referenceUsedMin: 42000,
      referenceUsedMax: 48000,
    },
  ];
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    fastify.log.info('Khajiit API server listening on http://localhost:3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
