import type { FastifyInstance } from 'fastify';

import { schemas } from '../../constants/schemas';
import { sendEmail } from '../../services/contact/sendEmail';

export const contactRoutes = (app: FastifyInstance) => {
  app.post('', { schema: schemas.contactSchemas.sendSupportMessage }, sendEmail);
};
