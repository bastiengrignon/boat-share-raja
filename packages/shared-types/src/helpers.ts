import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  isAnonymous: z.boolean().optional().nullable(),
  email: z.string().optional(),
  emailVerified: z.boolean().optional().nullable(),
});

export const queryIdSchema = z.object({
  id: z.string(),
});

export const queryUserIdSchema = z.object({
  userId: z.string(),
});

export const queryJourneyIdSchema = z.object({
  journeyId: z.string(),
});

export const queryConversationId = z.object({
  conversationId: z.string(),
});
