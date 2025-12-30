import { z } from 'zod';

import { toJsonSchemaSupported, userSchema } from './helpers.js';

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

const addJourneyResponseSchema = z.object({
  id: z.string(),
  ...addJourneyBodySchema.shape,
  createdAt: z.string(),
});

const editJourneyBodySchema = z
  .object({
    id: z.string(),
    ...addJourneyBodySchema.shape,
  })
  .omit({ user: true });

const addPeopleToJourneyBodySchema = z.object({
  people: z.number(),
  user: userSchema,
});

export const journeySchemas = {
  addJourney: {
    body: toJsonSchemaSupported(addJourneyBodySchema),
    response: {
      200: toJsonSchemaSupported(addJourneyResponseSchema),
    },
  },
  myJourneys: {
    params: toJsonSchemaSupported(z.object({ userId: z.string() })),
  },
  addPeopleToJourney: {
    params: toJsonSchemaSupported(z.object({ id: z.string() })),
    body: toJsonSchemaSupported(addPeopleToJourneyBodySchema),
  },
  editJourney: {
    body: toJsonSchemaSupported(editJourneyBodySchema),
    params: toJsonSchemaSupported(z.object({ id: z.string() })),
  },
  deleteJourney: {
    params: toJsonSchemaSupported(z.object({ id: z.string() })),
  },
};
