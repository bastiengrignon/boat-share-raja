import type { QueryUserId } from '@boat-share-raja/shared-types';

import { createService, returnService } from '../../utils/service';

export const getArchivedConversations = createService<{ Params: QueryUserId }, { archivedConversations: object }>(
  'getArchivedConversations',
  async (req, rep) => {
    const { userId } = req.params;

    const archivedConversations = await req.prisma.archiveConversation.findMany({
      where: { userId },
      include: {
        user: true,
        otherUser: true,
      },
    });

    return returnService(rep, {
      status: 'SUCCESS',
      data: {
        archivedConversations,
      },
    });
  }
);
