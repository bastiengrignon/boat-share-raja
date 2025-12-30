import type { FastifyInstance } from 'fastify';

import { schemas } from '../../constants/schemas';
import { getJourneyRequest } from '../../services/journeyRequests/getJourneyRequest';
import { handleJourneyRequest } from '../../services/journeyRequests/handleJourneyRequest';

export const journeyRequestRoutes = (app: FastifyInstance) => {
  app.get('/:requestId', { schema: schemas.journeyRequestSchemas.journeyRequestGet }, getJourneyRequest);
  app.patch('', { schema: schemas.journeyRequestSchemas.journeyRequestAcceptation }, handleJourneyRequest);
};
