import type { FastifyInstance } from 'fastify';

import { schemas } from '../../constants/schemas';
import { addJourney } from '../../services/journeys/addJourney';
import { addPeopleToJourney } from '../../services/journeys/addPeopleToJourney';
import { deleteJourney } from '../../services/journeys/deleteJourney';
import { getAllJourneys } from '../../services/journeys/getAllJourneys';
import { getMyJourneys } from '../../services/journeys/getMyJourneys';
import { updateJourney } from '../../services/journeys/updateJourney';

export const journeyRoutes = (app: FastifyInstance) => {
  app.get('', getAllJourneys);
  app.post('', { schema: schemas.journeySchemas.addJourney }, addJourney);
  app.post('/:id/people', { schema: schemas.journeySchemas.addPeopleToJourney }, addPeopleToJourney);
  app.put('/:id', { schema: schemas.journeySchemas.editJourney }, updateJourney);
  app.delete('/:id', { schema: schemas.journeySchemas.deleteJourney }, deleteJourney);
  app.get('/user/:userId', { schema: schemas.journeySchemas.myJourneys }, getMyJourneys);
};
