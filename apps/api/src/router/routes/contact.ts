import { schemas } from '@boat-share-raja/shared-types';
import type { FastifyInstance } from 'fastify';

import { sendEmail } from '../../services/contact/sendEmail';

export const contactRoutes = (app: FastifyInstance) => {
  app.post('', { schema: schemas.contactSchema.sendSupport }, sendEmail);
};
