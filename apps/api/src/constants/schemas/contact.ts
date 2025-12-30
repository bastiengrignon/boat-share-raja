import { z } from 'zod';

import { statusSchema, toJsonSchemaSupported } from './helpers';

const contactBodySchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  subject: z.string().optional(),
  message: z.string().min(1),
  userId: z.string().optional(),
});

const contactResponseSchema = z.object({
  status: statusSchema,
  data: z.boolean(),
});

export const contactSchemas = {
  sendSupportMessage: {
    body: toJsonSchemaSupported(contactBodySchema),
    response: {
      200: toJsonSchemaSupported(contactResponseSchema),
    },
  },
};
