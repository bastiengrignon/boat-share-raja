import type { FastifyInstance } from 'fastify';

import { blockUser } from '../../services/moderation/blockUser';
import { reportUser } from '../../services/moderation/reportUser';

export const moderationRoutes = (app: FastifyInstance) => {
  app.post('/block', blockUser);
  app.post('/report', reportUser);
};
