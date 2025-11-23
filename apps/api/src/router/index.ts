import type { FastifyInstance } from 'fastify';

import { API_ROUTES } from '../constants';
import { initMiddlewares } from '../middlewares/init';
import { printFastifyRoutes } from '../utils/routes';
import { routes } from './routes';

export const initRoutes = async ({ app }: { app: FastifyInstance }) => {
  initMiddlewares({ app });
  app.register(routes, { prefix: API_ROUTES.defaultApiPath });
  printFastifyRoutes({ app });
};
