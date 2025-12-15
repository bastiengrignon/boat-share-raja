import type { ApiResult, QueryUserId } from '@boat-share-raja/shared-types';
import type { FastifyRequest } from 'fastify';

export const getUserConversations = async (
  req: FastifyRequest<{ Params: QueryUserId }>
): Promise<ApiResult<object>> => {
  const { userId } = req.params;
  const archivedConversations = await req.prisma.archiveConversation.findMany({
    where: { userId },
    select: { otherUserId: true },
  });

  const archivedIds = archivedConversations.map(({ otherUserId }) => otherUserId);

  const conversations = await req.prisma.conversation.findMany({
    where: {
      participants: {
        some: { userId },
        none: { userId: { in: archivedIds } },
      },
    },
    include: {
      participants: {
        include: {
          user: true,
        },
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: {
          sender: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
    omit: {
      createdAt: true,
    },
  });

  const conversationsWithUnread = await Promise.all(
    conversations.map(async (conversation) => {
      const unreadCount = await req.prisma.message.count({
        where: {
          conversationId: conversation.id,
          senderId: { not: userId },
          reads: {
            none: {
              userId,
            },
          },
        },
      });

      return {
        ...conversation,
        unreadCount,
      };
    })
  );

  return {
    status: 'SUCCESS',
    data: {
      conversations: conversationsWithUnread,
    },
  };
};
