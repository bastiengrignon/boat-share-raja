import type { ApiResult } from '@boat-share-raja/shared-types';
import type { FastifyRequest } from 'fastify';

export const getConversationMessages = async (
  req: FastifyRequest<{ Params: { conversationId: string }; Querystring: { cursor?: string; take?: string } }>
): Promise<ApiResult<object>> => {
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

  return {
    status: 'SUCCESS',
    data: {
      messages,
      nextCursor,
      hasMore,
    },
  };
};
