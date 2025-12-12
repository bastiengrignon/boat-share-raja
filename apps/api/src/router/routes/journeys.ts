import type { FastifyInstance } from 'fastify';

import { addJourney } from '../../services/journeys/addJourney';
import { addPeopleToJourney } from '../../services/journeys/addPeopleToJourney';
import { deleteJourney } from '../../services/journeys/deleteJourney';
import { getAllJourneys } from '../../services/journeys/getAllJourneys';
import { getMyJourneys } from '../../services/journeys/getMyJourneys';
import { updateJourney } from '../../services/journeys/updateJourney';

const addJourneySchema = {
  body: {
    type: 'object',
    properties: {
      user: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
        },
      },
      numberOfPeople: { type: 'number' },
      maxNumberOfPeople: { type: 'number' },
      from: { type: 'string' },
      to: { type: 'string' },
      date: { type: 'string' },
      time: { type: 'string' },
      price: { type: 'number' },
      notes: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
          },
        },
        from: { type: 'string' },
        to: { type: 'string' },
        date: { type: 'string' },
        createdAt: { type: 'string' },
      },
    },
  },
};

export const journeyRoutes = (app: FastifyInstance) => {
  app.get('', getAllJourneys);
  app.post('', { schema: addJourneySchema }, addJourney);
  app.post('/:id/people', addPeopleToJourney);
  app.put('/:id', updateJourney);
  app.delete('/:id', deleteJourney);
  app.get('/user/:userId', getMyJourneys);
};
