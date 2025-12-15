import type { ApiResult } from '@boat-share-raja/shared-types';
import type { FastifyRequest } from 'fastify';
import { z } from 'zod';

const blockBodySchema = z.object({
  userId: z.string(),
  blockedUserId: z.string(),
});

export const blockUser = async (
  req: FastifyRequest<{ Body: z.infer<typeof blockBodySchema> }>
): Promise<ApiResult<object>> => {
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
};
