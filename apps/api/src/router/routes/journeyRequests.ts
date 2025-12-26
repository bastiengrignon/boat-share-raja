import { schemas } from '@boat-share-raja/shared-types';
import type { FastifyInstance } from 'fastify';

import { getJourneyRequest } from '../../services/journeyRequests/getJourneyRequest';
import { handleJourneyRequest } from '../../services/journeyRequests/handleJourneyRequest';

export const journeyRequestRoutes = (app: FastifyInstance) => {
  app.get('/:requestId', { schema: schemas.journeyRequestSchemas.journeyRequestGet }, getJourneyRequest);
  app.patch('', { schema: schemas.journeyRequestSchemas.journeyRequestAcceptation }, handleJourneyRequest);
};
