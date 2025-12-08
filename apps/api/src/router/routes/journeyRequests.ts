import type { FastifyInstance } from 'fastify';

import { getJourneyRequest } from '../../services/journeyRequests/getJourneyRequest';
import { handleJourneyRequest } from '../../services/journeyRequests/handleJourneyRequest';

export const journeyRequestRoutes = (app: FastifyInstance) => {
  app.get('/:requestId', getJourneyRequest);
  app.patch('', handleJourneyRequest);
};
