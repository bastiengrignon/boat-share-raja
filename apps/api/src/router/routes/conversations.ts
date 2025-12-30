import type { FastifyInstance } from 'fastify';

import { schemas } from '../../constants/schemas';
import { archiveConversation } from '../../services/conversations/archiveConversation';
import { checkOrCreateConversation } from '../../services/conversations/checkOrCreateConversation';
import { createConversation } from '../../services/conversations/createConversation';
import { getArchivedConversations } from '../../services/conversations/getArchivedConversations';
import { getConversation } from '../../services/conversations/getConversation';
import { getConversationMessages } from '../../services/conversations/getConversationMessages';
import { getUnreadMessages } from '../../services/conversations/getUnreadMessages';
import { getUserConversations } from '../../services/conversations/getUserConversations';
import { markConversationAsRead } from '../../services/conversations/markConversationAsRead';
import { sendMessage } from '../../services/conversations/sendMessage';

export const conversationsRoutes = (app: FastifyInstance) => {
  app.post('', { schema: schemas.conversationSchema.createConversation }, createConversation);
  app.put('', { schema: schemas.conversationSchema.checkOrCreateConversation }, checkOrCreateConversation);
  app.get('/:userId', { schema: schemas.conversationSchema.getUserConversations }, getUserConversations);
  app.get('/:conversationId/information', { schema: schemas.conversationSchema.getConversation }, getConversation);
  app.get(
    '/:conversationId/messages',
    { schema: schemas.conversationSchema.getConversationMessages },
    getConversationMessages
  );
  app.post('/:conversationId/messages', { schema: schemas.conversationSchema.sendMessage }, sendMessage);
  app.post('/:conversationId/read', { schema: schemas.conversationSchema.markAsRead }, markConversationAsRead);
  app.post('/:conversationId/archive', { schema: schemas.conversationSchema.archiveConversation }, archiveConversation);
  app.get(
    '/:userId/archive',
    { schema: schemas.conversationSchema.getArchivedConversations },
    getArchivedConversations
  );
  app.get('/:userId/unread', { schema: schemas.conversationSchema.getUnreadMessages }, getUnreadMessages);
};
