import type { QueryConversationId } from '@boat-share-raja/shared-types';

import { createService, returnService } from '../../utils/service';

export const getConversationMessages = createService<
  { Params: QueryConversationId; Querystring: { cursor?: string; take?: string } },
  object
>('getConversationMessages', async (req, rep) => {
  const { conversationId } = req.params;
  const take = req.query.take ? Number(req.query.take) : 20;
  const cursor = req.query.cursor;

  const messages = await req.prisma.message.findMany({
    where: {
      conversationId,
    },
    take: take + 1,
    orderBy: { createdAt: 'desc' },
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : 0,
    include: {
      sender: true,
    },
  });

  const hasMore = messages.length > take;
  if (hasMore) {
    messages.pop();
  }
  const nextCursor = hasMore ? messages[messages.length - 1]?.id : null;

  return returnService(rep, {
    status: 'SUCCESS',
    data: {
      messages,
      nextCursor,
      hasMore,
    },
  });
});
