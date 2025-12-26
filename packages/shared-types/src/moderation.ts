import { z } from 'zod';

import { queryUserIdSchema } from './helpers';

const blockUserBodySchema = z.object({
  ...queryUserIdSchema.shape,
  blockedUserId: z.string(),
});

const reportUserBodySchema = z.object({
  ...queryUserIdSchema.shape,
  reportedUserId: z.string(),
  reason: z.string(),
});

export const moderationSchemas = {
  blockUser: {
    body: blockUserBodySchema,
  },
  reportUser: {
    body: reportUserBodySchema,
  },
};
