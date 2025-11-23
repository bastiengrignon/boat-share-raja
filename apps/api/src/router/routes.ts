import type { FastifyInstance } from 'fastify';

import { API_ROUTES } from '../constants';
import { healthcheckRoutes } from './routes/healthcheck';

export const routes = async (app: FastifyInstance) => {
  app.register(healthcheckRoutes, { prefix: API_ROUTES.healthcheck });
};
