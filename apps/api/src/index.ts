import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';

const fastify = Fastify({
  logger: true
});

const prisma = new PrismaClient();

fastify.register(cors, {
  origin: true // Enable for all origins in development
});

// Basic health check route
fastify.get('/api/health', async (request, reply) => {
  return { status: 'ok', message: 'FairTrade API is running' };
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    fastify.log.info(`Server listening on http://localhost:3001`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
