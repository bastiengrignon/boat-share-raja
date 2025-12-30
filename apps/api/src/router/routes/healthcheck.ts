import type { FastifyInstance } from 'fastify';

import { schemas } from '../../constants/schemas';

export const healthcheckRoutes = (app: FastifyInstance) => {
  app.get('', { schema: schemas.healthcheckSchemas.healthcheck }, () => ({
    status: 'SUCCESS',
    message: 'API is healthy',
  }));
};
