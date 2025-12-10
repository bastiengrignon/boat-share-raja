import type { QueryUserId } from '@boat-share-raja/shared-types';
import type { FastifyRequest } from 'fastify';

export const getUnreadMessages = async (req: FastifyRequest<{ Params: QueryUserId }>) => {
  const { userId } = req.params;
  const unreadCount = await req.prisma.message.count({
    where: {
      conversation: { participants: { some: { userId } } },
      senderId: { not: userId },
      reads: { none: { userId } },
    },
  });

  return {
    status: 'SUCCESS',
    data: {
      unreadCount,
    },
  };
};
