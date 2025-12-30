import type { QueryUserId } from '@boat-share-raja/shared-types';

import { createService, returnService } from '../../utils/service';

export const getUserConversations = createService<{ Params: QueryUserId }, { conversations: object }>(
  'getUserConversations',
  async (req, rep) => {
    const { userId } = req.params;
    const archivedConversations = await req.prisma.archiveConversation.findMany({
      where: { userId },
      select: { otherUserId: true },
    });

    const archivedIds = archivedConversations.map(({ otherUserId }) => otherUserId);

    const userBlocks = await req.prisma.userBlock.findMany({
      where: {
        OR: [{ blockerId: userId }, { blockedId: userId }],
      },
      select: { blockerId: true, blockedId: true },
    });

    const blockedIds = userBlocks.map(({ blockedId, blockerId }) => (blockerId === userId ? blockedId : blockerId));
    const excludedIds = Array.from(new Set([...archivedIds, ...blockedIds]));

    const conversations = await req.prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId },
          none: { userId: { in: excludedIds } },
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

    return returnService(rep, {
      status: 'SUCCESS',
      data: {
        conversations: conversationsWithUnread,
      },
    });
  }
);
