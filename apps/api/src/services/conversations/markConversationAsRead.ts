import type { QueryConversationId } from '@boat-share-raja/shared-types';
import type { FastifyRequest } from 'fastify';
import { z } from 'zod';

const markConversationAsReadBodySchema = z.object({
  userId: z.uuid(),
});

export const markConversationAsRead = async (
  req: FastifyRequest<{ Params: QueryConversationId; Body: z.infer<typeof markConversationAsReadBodySchema> }>
) => {
  const { conversationId } = req.params;
  const parseResult = markConversationAsReadBodySchema.safeParse(req.body);

  if (!parseResult.success) {
    return {
      status: 'ERROR',
      error: parseResult.error.message,
      data: null,
    };
  }
  const { userId } = parseResult.data;

  const participant = await req.prisma.conversationParticipant.findFirst({
    where: { conversationId, userId },
  });
  if (!participant) {
    return {
      status: 'ERROR',
      error: 'NOT_IN_CONVERSATION',
      data: null,
    };
  }

  const unreadMessages = await req.prisma.message.findMany({
    where: {
      conversationId,
      senderId: { not: userId },
      reads: {
        none: {
          userId,
        },
      },
    },
    select: {
      id: true,
    },
  });
  if (unreadMessages.length === 0) {
    return {
      status: 'SUCCESS',
      data: { updated: 0 },
    };
  }

  await req.prisma.messageRead.createMany({
    data: unreadMessages.map((message) => ({
      messageId: message.id,
      userId,
      readAt: new Date(),
    })),
    skipDuplicates: true,
  });

  return {
    status: 'SUCCESS',
    data: { updated: unreadMessages.length },
  };
};
