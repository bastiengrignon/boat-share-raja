import type { QueryUserId } from '@boat-share-raja/shared-types';
import type { Journey } from '@prisma/client';

import { createService, returnService } from '../../utils/service';

export const getMyJourneys = createService<{ Params: QueryUserId }, { journeys: Omit<Journey, 'updatedAt'>[] }>(
  'getMyJourneys',
  async (req, rep) => {
    const journeys = await req.prisma.journey.findMany({
      where: {
        userId: req.params.userId,
      },
      include: {
        user: true,
        JourneyRequest: true,
      },
      omit: {
        updatedAt: true,
      },
    });

    const formattedJourneys = journeys.map(({ JourneyRequest, ...rest }) => ({
      ...rest,
      journeyRequest: JourneyRequest,
    }));

    return returnService(rep, {
      status: 'SUCCESS',
      data: {
        journeys: formattedJourneys,
      },
    });
  }
);
