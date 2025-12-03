import type { FastifyInstance } from 'fastify';

const healthcheckGetSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        message: { type: 'string' },
      },
    },
  },
};

export const healthcheckRoutes = (app: FastifyInstance) => {
  app.get('', { schema: healthcheckGetSchema }, () => ({
    status: 'OK',
    message: 'API is healthy',
  }));
};
