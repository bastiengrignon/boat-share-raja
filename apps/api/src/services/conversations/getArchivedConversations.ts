import type { ApiResult, QueryUserId } from '@boat-share-raja/shared-types';
import type { FastifyRequest } from 'fastify';

export const getArchivedConversations = async (
  req: FastifyRequest<{ Params: QueryUserId }>
): Promise<ApiResult<object>> => {
  const { userId } = req.params;

  const archivedConversations = await req.prisma.archiveConversation.findMany({
    where: { userId },
    include: {
      user: true,
      otherUser: true,
    },
  });

  return {
    status: 'SUCCESS',
    data: {
      archivedConversations,
    },
  };
};
