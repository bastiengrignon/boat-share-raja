import type { QueryUserId } from '@boat-share-raja/shared-types';

import { createService } from '../../utils/service';

export const getUnreadMessages = createService<{ Params: QueryUserId }, { unreadCount: number }>(
  'getUnreadMessages',
  async (req) => {
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
  }
);
