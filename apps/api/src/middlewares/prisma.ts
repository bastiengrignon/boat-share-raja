import fp from 'fastify-plugin';

import { prisma } from '../utils/prisma';

export const prismaPlugin = fp(async (app) => {
  if (app.prisma) {
    app.log.warn('Prisma is already initialized');
    return;
  }
  await prisma.$connect();

  app
    .decorate('prisma', prisma)
    .decorateRequest('prisma', { getter: () => app.prisma })
    .addHook('onClose', async (fastify) => {
      fastify.log.info('Disconnecting Prisma from DB');
      await prisma.$disconnect();
    });
});
