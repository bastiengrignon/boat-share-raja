import { z } from 'zod';

import { queryIdSchema, queryJourneyIdSchema, queryUserIdSchema, userSchema } from './helpers';

const addJourneyBodySchema = z.object({
  user: userSchema,
  numberOfPeople: z.number(),
  maxNumberOfPeople: z.number(),
  from: z.string(),
  to: z.string(),
  date: z.string(),
  time: z.string().optional(),
  price: z.number().optional().nullable(),
  notes: z.string().optional(),
});

const editJourneyBodySchema = z
  .object({
    ...queryIdSchema.shape,
    ...addJourneyBodySchema.shape,
  })
  .omit({ user: true });

const addPeopleToJourneyBodySchema = z.object({
  people: z.number(),
  user: userSchema,
});

export const journeySchemas = {
  addJourney: {
    body: addJourneyBodySchema,
  },
  myJourneys: {
    params: queryUserIdSchema,
  },
  addPeopleToJourney: {
    params: queryJourneyIdSchema,
    body: addPeopleToJourneyBodySchema,
  },
  editJourney: {
    body: editJourneyBodySchema,
    params: queryJourneyIdSchema,
  },
  deleteJourney: {
    params: queryJourneyIdSchema,
  },
};
