import type { FastifyInstance } from 'fastify';

import { API_ROUTES } from '../constants';
import { fastifyBetterAuthHandler } from '../utils/auth';
import { contactRoutes } from './routes/contact';
import { conversationsRoutes } from './routes/conversations';
import { healthcheckRoutes } from './routes/healthcheck';
import { islandsRoutes } from './routes/islands';
import { journeyRequestRoutes } from './routes/journeyRequests';
import { journeyRoutes } from './routes/journeys';
import { moderationRoutes } from './routes/moderation';

export const routes = async (app: FastifyInstance) => {
  app.register(healthcheckRoutes, { prefix: API_ROUTES.healthcheck });
  app.register(journeyRoutes, { prefix: API_ROUTES.journeys });
  app.register(journeyRequestRoutes, { prefix: API_ROUTES.journeyRequests });
  app.register(islandsRoutes, { prefix: API_ROUTES.islands });
  app.register(conversationsRoutes, { prefix: API_ROUTES.conversations });
  app.register(contactRoutes, { prefix: API_ROUTES.contact });
  app.register(moderationRoutes, { prefix: API_ROUTES.moderation });
  app.route({ method: ['GET', 'POST'], url: `${API_ROUTES.auth}/*`, handler: fastifyBetterAuthHandler });
};
