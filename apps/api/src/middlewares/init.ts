import fastifyCompress from '@fastify/compress';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import type { FastifyInstance } from 'fastify';

import { TIME } from '../constants';
import serverConfig from '../utils/config';

export const initMiddlewares = ({ app }: { app: FastifyInstance }) => {
  app.register(fastifyHelmet);
  app.register(fastifyCompress);
  app.register(fastifyCors, {
    origin: serverConfig.trustedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: TIME.SECONDS_IN_ONE_DAY,
  });
};
