import type { FastifyInstance } from 'fastify';

import { handleJourneyRequest } from '../../services/journeyRequests/handleJourneyRequest';

export const journeyRequestRoutes = (app: FastifyInstance) => {
  app.patch('', handleJourneyRequest);
};
