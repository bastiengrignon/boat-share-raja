import { z } from 'zod';

import { toJsonSchemaSupported } from './helpers';

const blockUserBodySchema = z.object({
  userId: z.string(),
  blockedUserId: z.string(),
});

const reportUserBodySchema = z.object({
  userId: z.string(),
  reportedUserId: z.string(),
  reason: z.string(),
});

export const moderationSchemas = {
  blockUser: {
    body: toJsonSchemaSupported(blockUserBodySchema),
  },
  reportUser: {
    body: toJsonSchemaSupported(reportUserBodySchema),
  },
};
