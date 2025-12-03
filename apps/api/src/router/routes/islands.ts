import type { FastifyInstance } from 'fastify';

import { getIslands } from '../../services/islands/getIslands';

export const islandsRoutes = (app: FastifyInstance) => {
  app.get('', getIslands);
};
