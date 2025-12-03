import type { ApiResult, QueryConversationId } from '@boat-share-raja/shared-types';
import type { FastifyRequest } from 'fastify';

export const getConversation = async (
  req: FastifyRequest<{ Params: QueryConversationId }>
): Promise<ApiResult<object>> => {
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
    return {
      status: 'ERROR',
      error: 'CONVERSATION_NOT_FOUND',
      data: null,
    };
  }

  return {
    status: 'SUCCESS',
    data: {
      conversation,
    },
  };
};
