import { schemas } from '@boat-share-raja/shared-types';
import type { FastifyInstance } from 'fastify';

import { blockUser } from '../../services/moderation/blockUser';
import { reportUser } from '../../services/moderation/reportUser';

export const moderationRoutes = (app: FastifyInstance) => {
  app.post('/block', { schema: schemas.moderationSchemas.blockUser }, blockUser);
  app.post('/report', { schema: schemas.moderationSchemas.reportUser }, reportUser);
};
