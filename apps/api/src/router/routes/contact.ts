import type { FastifyInstance } from 'fastify';

import { sendEmail } from '../../services/contact/sendEmail';

export const contactRoutes = (app: FastifyInstance) => {
  app.post('', sendEmail);
};
