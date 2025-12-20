import { z } from 'zod';

import { createService } from '../../utils/service';

const blockBodySchema = z.object({
  userId: z.string(),
  blockedUserId: z.string(),
});

export const blockUser = createService<{ Body: z.infer<typeof blockBodySchema> }, object>('blockUser', async (req) => {
  const { userId, blockedUserId } = req.body;

  if (userId === blockedUserId) {
    return {
      status: 'ERROR',
      error: 'CANNOT_BLOCK_YOURSELF',
      data: null,
    };
  }

  const blockedUser = await req.prisma.userBlock.upsert({
    create: { blockerId: userId, blockedId: blockedUserId },
    update: {},
    where: { blockerId_blockedId: { blockerId: userId, blockedId: blockedUserId } },
  });

  return {
    status: 'SUCCESS',
    data: blockedUser,
  };
});
