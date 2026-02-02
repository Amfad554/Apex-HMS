import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL not found in environment variables');
}

export const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

console.log('✓ Prisma client initialized');