import type { ApiResult, QueryConversationId } from '@boat-share-raja/shared-types';
import dayjs from 'dayjs';
import type { FastifyRequest } from 'fastify';
import { z } from 'zod';

const archiveConversationBodySchema = z.object({
  userId: z.string(),
});

export const archiveConversation = async (
  req: FastifyRequest<{ Body: z.infer<typeof archiveConversationBodySchema>; Params: QueryConversationId }>
): Promise<ApiResult<object>> => {
  const { conversationId } = req.params;
  const { userId } = req.body;

  const conversation = await req.prisma.conversation.findFirst({
    where: { id: conversationId },
    select: {
      participants: {
        select: {
          userId: true,
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

  const otherUserId = conversation.participants.find((p) => p.userId !== userId)?.userId;
  if (!otherUserId) {
    return {
      status: 'ERROR',
      error: 'USER_RECEIVER_NOT_FOUND',
      data: null,
    };
  }

  const archivedConversations = await req.prisma.archiveConversation.upsert({
    where: { userId_otherUserId: { userId, otherUserId } },
    update: { archivedAt: dayjs().toDate() },
    create: { userId: userId, otherUserId },
  });

  return {
    status: 'SUCCESS',
    data: { archivedConversations },
  };
};
