import type { FastifyInstance } from 'fastify';

import { schemas } from '../../constants/schemas';
import { blockUser } from '../../services/moderation/blockUser';
import { reportUser } from '../../services/moderation/reportUser';

export const moderationRoutes = (app: FastifyInstance) => {
  app.post('/block', { schema: schemas.moderationSchemas.blockUser }, blockUser);
  app.post('/report', { schema: schemas.moderationSchemas.reportUser }, reportUser);
};
