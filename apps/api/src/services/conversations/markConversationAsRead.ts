import type { QueryConversationId } from '@boat-share-raja/shared-types';
import { z } from 'zod';

import { createService, returnService } from '../../utils/service';

const markConversationAsReadBodySchema = z.object({
  userId: z.uuid(),
});

export const markConversationAsRead = createService<
  { Params: QueryConversationId; Body: z.infer<typeof markConversationAsReadBodySchema> },
  { updated: number }
>('markConversationAsRead', async (req, rep) => {
  const { conversationId } = req.params;
  const parseResult = markConversationAsReadBodySchema.safeParse(req.body);

  if (!parseResult.success) {
    return returnService(rep, {
      status: 'ERROR',
      error: parseResult.error.message,
      data: null,
    });
  }
  const { userId } = parseResult.data;

  const participant = await req.prisma.conversationParticipant.findFirst({
    where: { conversationId, userId },
  });
  if (!participant) {
    return returnService(rep, {
      status: 'ERROR',
      error: 'NOT_IN_CONVERSATION',
      data: null,
    });
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
    return returnService(rep, {
      status: 'SUCCESS',
      data: { updated: 0 },
    });
  }

  await req.prisma.messageRead.createMany({
    data: unreadMessages.map((message) => ({
      messageId: message.id,
      userId,
      readAt: new Date(),
    })),
    skipDuplicates: true,
  });

  return returnService(rep, {
    status: 'SUCCESS',
    data: { updated: unreadMessages.length },
  });
});
