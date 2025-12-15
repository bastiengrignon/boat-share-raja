import type { ApiResult } from '@boat-share-raja/shared-types';
import type { FastifyRequest } from 'fastify';
import { z } from 'zod';

const reportUserBodySchema = z.object({
  userId: z.string(),
  reportedUserId: z.string(),
  reason: z.string(),
});

export const reportUser = async (
  req: FastifyRequest<{ Body: z.infer<typeof reportUserBodySchema> }>
): Promise<ApiResult<object>> => {
  const { userId, reportedUserId, reason } = req.body;

  if (userId === reportedUserId) {
    return {
      status: 'ERROR',
      error: 'CANNOT_REPORT_YOURSELF',
      data: null,
    };
  }

  const report = await req.prisma.userReport.create({
    data: {
      reporterId: userId,
      reportedId: reportedUserId,
      reason,
    },
  });

  return {
    status: 'SUCCESS',
    data: { report },
  };
};
