import type { QueryConversationId } from '@boat-share-raja/shared-types';

import { createService, returnService } from '../../utils/service';

export const getConversation = createService<{ Params: QueryConversationId }, object>(
  'getConversation',
  async (req, rep) => {
    const conversation = await req.prisma.conversation.findFirst({
      where: {
        id: req.params.conversationId,
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    });
    if (!conversation) {
      return returnService(rep, {
        status: 'ERROR',
        error: 'CONVERSATION_NOT_FOUND',
        data: null,
      });
    }

    return returnService(rep, {
      status: 'SUCCESS',
      data: {
        conversation,
      },
    });
  }
);
