import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { sendEmail } from '../../services/contact/sendEmail';

const contactBodySchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  subject: z.string().optional(),
  message: z.string().min(1),
  userId: z.string().optional(),
});

const contactResponseSchema = z.object({
  status: z.enum(['SUCCESS', 'ERROR']),
  data: z.boolean(),
});

const schema = {
  body: z.toJSONSchema(contactBodySchema, { target: 'draft-07' }),
  response: {
    200: z.toJSONSchema(contactResponseSchema, { target: 'draft-07' }),
  },
};

export const contactRoutes = (app: FastifyInstance) => {
  app.post('', { schema }, sendEmail);
};
