import { z } from 'zod';

import { toJsonSchemaSupported } from './helpers';

const journeyRequestParamsSchema = z.object({
  requestId: z.string(),
});

const journeyRequestAcceptationSchema = z.object({
  accepted: z.boolean(),
  requestId: z.string(),
});

export const journeyRequestSchemas = {
  journeyRequestAcceptation: {
    body: toJsonSchemaSupported(journeyRequestAcceptationSchema),
  },
  journeyRequestGet: {
    params: toJsonSchemaSupported(journeyRequestParamsSchema),
  },
};
