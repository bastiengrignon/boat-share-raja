import { z } from 'zod';

import { createService, returnService } from '../../utils/service';

const reportUserBodySchema = z.object({
  userId: z.string(),
  reportedUserId: z.string(),
  reason: z.string(),
});

export const reportUser = createService<{ Body: z.infer<typeof reportUserBodySchema> }, { report: object }>(
  'reportUser',
  async (req, rep) => {
    const { userId, reportedUserId, reason } = req.body;

    if (userId === reportedUserId) {
      return returnService(rep, {
        status: 'ERROR',
        error: 'CANNOT_REPORT_YOURSELF',
        data: null,
      });
    }

    const report = await req.prisma.userReport.create({
      data: {
        reporterId: userId,
        reportedId: reportedUserId,
        reason,
      },
    });

    return returnService(rep, {
      status: 'SUCCESS',
      data: { report },
    });
  }
);
