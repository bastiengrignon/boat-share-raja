import { z } from 'zod';

const journeyRequestParamsSchema = z.object({
  requestId: z.string(),
});

const journeyRequestAcceptationSchema = z.object({
  accepted: z.boolean(),
  requestId: z.string(),
});

export const journeyRequestSchemas = {
  journeyRequestAcceptation: {
    body: journeyRequestAcceptationSchema,
  },
  journeyRequestGet: {
    params: journeyRequestParamsSchema,
  },
};
