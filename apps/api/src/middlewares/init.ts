import fastifyCompress from '@fastify/compress';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fastifyRateLimit from '@fastify/rate-limit';
import type { FastifyInstance } from 'fastify';

import { TIME } from '../constants';
import serverConfig from '../utils/config';
import { colorSchemePlugin } from './colorScheme';
import { emailPlugin } from './email';
import { languagePlugin } from './language';
import { prismaPlugin } from './prisma';

export const initMiddlewares = ({ app }: { app: FastifyInstance }) => {
  app.register(fastifyHelmet);
  app.register(fastifyCompress);
  app.register(fastifyRateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });
  app.register(fastifyCors, {
    origin: serverConfig.trustedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept-Language',
      'X-Color-Scheme',
      'Cookie',
    ],
    credentials: true,
    maxAge: TIME.SECONDS_IN_ONE_DAY,
  });
  app.register(languagePlugin);
  app.register(colorSchemePlugin);
  app.register(prismaPlugin);
  app.register(emailPlugin);
};
