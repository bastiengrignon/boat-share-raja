import { z } from 'zod';

import { createService, returnService } from '../../utils/service';

const blockBodySchema = z.object({
  userId: z.string(),
  blockedUserId: z.string(),
});

export const blockUser = createService<{ Body: z.infer<typeof blockBodySchema> }, object>(
  'blockUser',
  async (req, rep) => {
    const { userId, blockedUserId } = req.body;

    if (userId === blockedUserId) {
      req.log.error('You cannot block yourself');
      return returnService(rep, {
        status: 'ERROR',
        error: 'CANNOT_BLOCK_YOURSELF',
        data: null,
      });
    }
    const user = await req.prisma.user.findFirst({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) {
      req.log.error('User not found');
      return returnService(rep, {
        status: 'ERROR',
        error: 'USER_NOT_FOUND',
        data: null,
      });
    }

    const userToBlock = await req.prisma.user.findFirst({
      where: { id: blockedUserId },
      select: { id: true },
    });
    if (!userToBlock) {
      req.log.error('User to block not found');
      return returnService(rep, {
        status: 'ERROR',
        error: 'USER_TO_BLOCK_NOT_FOUND',
        data: null,
      });
    }

    const blockedUser = await req.prisma.userBlock.upsert({
      create: { blockerId: user.id, blockedId: blockedUserId },
      update: {},
      where: { blockerId_blockedId: { blockerId: user.id, blockedId: blockedUserId } },
    });

    return returnService(rep, {
      status: 'SUCCESS',
      data: blockedUser,
    });
  }
);
