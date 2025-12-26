import type { ReportUserBody } from '@boat-share-raja/shared-types';

import { createService } from '../../utils/service';

export const reportUser = createService<{ Body: ReportUserBody }, { report: object }>('reportUser', async (req) => {
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
});
