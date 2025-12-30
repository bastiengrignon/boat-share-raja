import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { blockUser } from '../../services/moderation/blockUser';
import { reportUser } from '../../services/moderation/reportUser';

const blockUserBodySchema = z.object({
  userId: z.string(),
  blockedUserId: z.string(),
});

const reportUserBodySchema = z.object({
  userId: z.string(),
  reportedUserId: z.string(),
  reason: z.string(),
});

const blockUserSchema = {
  body: z.toJSONSchema(blockUserBodySchema, { target: 'draft-07' }),
};

const reportUserSchema = {
  body: z.toJSONSchema(reportUserBodySchema, { target: 'draft-07' }),
};

export const moderationRoutes = (app: FastifyInstance) => {
  app.post('/block', { schema: blockUserSchema }, blockUser);
  app.post('/report', { schema: reportUserSchema }, reportUser);
};
