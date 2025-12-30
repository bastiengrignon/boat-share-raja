import { z } from 'zod';

import { statusSchema, toJsonSchemaSupported } from './helpers';

const healthcheckResponseSchema = z.object({
  status: statusSchema,
  message: z.string(),
});

export const healthcheckSchemas = {
  healthcheck: {
    response: {
      200: toJsonSchemaSupported(healthcheckResponseSchema),
    },
  },
};
