import type { FastifyInstance } from 'fastify';

import { API_ROUTES, HTTP_CODES } from '../constants';
import { auth } from '../utils/auth';
import { contactRoutes } from './routes/contact';
import { conversationsRoutes } from './routes/conversations';
import { healthcheckRoutes } from './routes/healthcheck';
import { islandsRoutes } from './routes/islands';
import { journeyRequestRoutes } from './routes/journeyRequests';
import { journeyRoutes } from './routes/journeys';

export const routes = async (app: FastifyInstance) => {
  app.register(healthcheckRoutes, { prefix: API_ROUTES.healthcheck });
  app.register(journeyRoutes, { prefix: API_ROUTES.journeys });
  app.register(journeyRequestRoutes, { prefix: API_ROUTES.journeyRequests });
  app.register(islandsRoutes, { prefix: API_ROUTES.islands });
  app.register(conversationsRoutes, { prefix: API_ROUTES.conversations });
  app.register(contactRoutes, { prefix: API_ROUTES.contact });
  app.route({
    method: ['GET', 'POST'],
    url: `${API_ROUTES.auth}/*`,
    async handler(request, reply) {
      try {
        const url = new URL(request.url, `http://${request.headers.host}`);

        const headers = new Headers();
        Object.entries(request.headers).forEach(([key, value]) => {
          if (value) headers.append(key, value.toString());
        });

        const req = new Request(url.toString(), {
          method: request.method,
          headers,
          body: request.body ? JSON.stringify(request.body) : undefined,
        });

        const response = await auth.handler(req);

        reply.status(response.status);
        response.headers.forEach((value, key) => {
          reply.header(key, value);
        });
        reply.send(response.body ? await response.text() : null);
      } catch (error) {
        app.log.error(`Authentication Error: ${error}`);
        reply.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send({
          error: 'Internal authentication error',
          code: 'AUTH_FAILURE',
        });
      }
    },
  });
};
