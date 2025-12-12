import fp from 'fastify-plugin';

import { emailService } from '../utils/email';

export const emailPlugin = fp(async (app) => {
  app.decorate('email', emailService);
  app.decorateRequest('email', { getter: () => app.email });
});
