import type { FastifyInstance } from 'fastify';

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
  app.post('', createConversation);
  app.put('', checkOrCreateConversation);
  app.get('/:userId', getUserConversations);
  app.get('/:conversationId/information', getConversation);
  app.get('/:conversationId/messages', getConversationMessages);
  app.post('/:conversationId/messages', sendMessage);
  app.post('/:conversationId/read', markConversationAsRead);
  app.post('/:conversationId/archive', archiveConversation);
  app.get('/:userId/archive', getArchivedConversations);
  app.get('/:userId/unread', getUnreadMessages);
};
