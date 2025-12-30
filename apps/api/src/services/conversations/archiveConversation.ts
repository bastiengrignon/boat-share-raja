import type { QueryConversationId } from '@boat-share-raja/shared-types';
import dayjs from 'dayjs';
import { z } from 'zod';

import { createService, returnService } from '../../utils/service';

const archiveConversationBodySchema = z.object({
  userId: z.string(),
});

export const archiveConversation = createService<
  {
    Params: QueryConversationId;
    Body: z.infer<typeof archiveConversationBodySchema>;
  },
  { archivedConversations: object }
>('archiveConversation', async (req, rep) => {
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
    return returnService(rep, {
      status: 'ERROR',
      error: 'CONVERSATION_NOT_FOUND',
      data: null,
    });
  }

  const otherUserId = conversation.participants.find((p) => p.userId !== userId)?.userId;
  if (!otherUserId) {
    return returnService(rep, {
      status: 'ERROR',
      error: 'USER_RECEIVER_NOT_FOUND',
      data: null,
    });
  }

  const archivedConversations = await req.prisma.archiveConversation.upsert({
    where: { userId_otherUserId: { userId, otherUserId } },
    update: { archivedAt: dayjs().toDate() },
    create: { userId: userId, otherUserId },
  });

  return returnService(rep, {
    status: 'SUCCESS',
    data: { archivedConversations },
  });
});
