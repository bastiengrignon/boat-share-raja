import { z } from 'zod';

const contactBodySchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  subject: z.string().optional(),
  message: z.string().min(1),
  userId: z.string().optional(),
});

export const contactSchema = {
  sendSupport: {
    body: contactBodySchema,
  },
};
