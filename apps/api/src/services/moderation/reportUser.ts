import { z } from 'zod';

import { createService } from '../../utils/service';

const reportUserBodySchema = z.object({
  userId: z.string(),
  reportedUserId: z.string(),
  reason: z.string(),
});

export const reportUser = createService<{ Body: z.infer<typeof reportUserBodySchema> }, object>(
  'reportUser',
  async (req) => {
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
  }
);
