import { schemas } from '@boat-share-raja/shared-types';
import type { FastifyInstance } from 'fastify';

import { addJourney } from '../../services/journeys/addJourney';
import { addPeopleToJourney } from '../../services/journeys/addPeopleToJourney';
import { deleteJourney } from '../../services/journeys/deleteJourney';
import { getAllJourneys } from '../../services/journeys/getAllJourneys';
import { getMyJourneys } from '../../services/journeys/getMyJourneys';
import { updateJourney } from '../../services/journeys/updateJourney';

export const journeyRoutes = (app: FastifyInstance) => {
  app.get('', getAllJourneys);
  app.post('', { schema: schemas.journeySchemas.addJourney }, addJourney);
  app.post('/:journeyId/people', { schema: schemas.journeySchemas.addPeopleToJourney }, addPeopleToJourney);
  app.put('/:journeyId', { schema: schemas.journeySchemas.editJourney }, updateJourney);
  app.delete('/:journeyId', { schema: schemas.journeySchemas.deleteJourney }, deleteJourney);
  app.get('/user/:userId', { schema: schemas.journeySchemas.myJourneys }, getMyJourneys);
};
