import { z } from 'zod';

import { toJsonSchemaSupported } from './helpers';

const createConversationBodySchema = z.object({
  title: z.string().optional(),
  isGroup: z.boolean().default(false),
  participantIds: z.array(z.uuid()).min(2),
});

const checkOrCreateConversationBodySchema = z.object({
  userIdA: z.uuid(),
  userIdB: z.uuid(),
});

const getConversationMessagesQuerySchema = z.object({
  cursor: z.string().optional(),
  take: z.string().optional(),
});

const sendMessageBodySchema = z.object({
  senderId: z.uuid(),
  content: z.string().min(1),
  extra: z.object({ journeyRequestId: z.string(), journeyId: z.string(), people: z.number() }).optional(),
  participantIds: z.array(z.uuid()).min(2).optional(),
});

export const conversationSchema = {
  createConversation: {
    body: toJsonSchemaSupported(createConversationBodySchema),
  },
  checkOrCreateConversation: {
    body: toJsonSchemaSupported(checkOrCreateConversationBodySchema),
  },
  getUserConversations: {
    params: toJsonSchemaSupported(z.object({ userId: z.uuid() })),
  },
  getConversation: {
    params: toJsonSchemaSupported(z.object({ conversationId: z.uuid() })),
  },
  getConversationMessages: {
    params: toJsonSchemaSupported(z.object({ conversationId: z.uuid() })),
    querystring: toJsonSchemaSupported(getConversationMessagesQuerySchema),
  },
  sendMessage: {
    params: toJsonSchemaSupported(z.object({ conversationId: z.uuid() })),
    body: toJsonSchemaSupported(sendMessageBodySchema),
  },
  markAsRead: {
    params: toJsonSchemaSupported(z.object({ conversationId: z.uuid() })),
    body: toJsonSchemaSupported(z.object({ userId: z.uuid() })),
  },
  archiveConversation: {
    params: toJsonSchemaSupported(z.object({ conversationId: z.uuid() })),
    body: toJsonSchemaSupported(z.object({ userId: z.uuid() })),
  },
  getArchivedConversations: {
    params: toJsonSchemaSupported(z.object({ userId: z.uuid() })),
  },
  getUnreadMessages: {
    params: toJsonSchemaSupported(z.object({ userId: z.uuid() })),
  },
};
