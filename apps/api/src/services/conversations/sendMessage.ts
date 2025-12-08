import type { ApiResult, QueryConversationId } from '@boat-share-raja/shared-types';
import type { FastifyRequest } from 'fastify';
import { z } from 'zod';

import { sendMessageInConversation } from '../../utils/message';

const sendMessageBodySchema = z.object({
  senderId: z.uuid(),
  content: z.string().min(1),
  extra: z.object({ journeyRequestId: z.string(), journeyId: z.string(), people: z.number() }).optional(),
  participantIds: z.array(z.uuid()).min(2).optional(),
});

export const sendMessage = async (
  req: FastifyRequest<{ Params: QueryConversationId; Body: z.infer<typeof sendMessageBodySchema> }>
): Promise<ApiResult<object>> => {
  const { conversationId } = req.params;
  const parseResult = sendMessageBodySchema.safeParse(req.body);

  if (!parseResult.success) {
    return {
      status: 'ERROR',
      error: parseResult.error.message,
      data: null,
    };
  }
  const { senderId, content, extra } = parseResult.data;

  const conversationExists = await req.prisma.conversation.findFirst({
    where: { id: conversationId },
  });
  if (!conversationExists) {
    return {
      status: 'ERROR',
      error: 'CONVERSATION_NOT_FOUND',
      data: null,
    };
  }

  const participant = await req.prisma.conversationParticipant.findFirst({
    where: { conversationId, userId: senderId },
  });
  if (!participant) {
    return {
      status: 'ERROR',
      error: 'NOT_IN_CONVERSATION',
      data: null,
    };
  }

  const message = await sendMessageInConversation(req.prisma)({ conversationId, senderId, content, extra });

  return {
    status: 'SUCCESS',
    data: {
      message,
    },
  };
};
