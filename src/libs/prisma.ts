import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Singleton
 * 
 * Evita múltiplas instâncias do Prisma Client, melhorando performance
 * e facilitando hot-reload em desenvolvimento.
 * 
 * Uso:
 * import prisma from '@/libs/prisma';
 * const obras = await prisma.obra.findMany();
 */
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'info', 'warn', 'error']
      : [],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;

