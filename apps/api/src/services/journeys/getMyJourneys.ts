import type { MyJourneysParams } from '@boat-share-raja/shared-types';
import type { Journey } from '@prisma/client';

import { createService } from '../../utils/service';

export const getMyJourneys = createService<{ Params: MyJourneysParams }, { journeys: Omit<Journey, 'updatedAt'>[] }>(
  'getMyJourneys',
  async (req) => {
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

    return {
      status: 'SUCCESS',
      data: {
        journeys: formattedJourneys,
      },
    };
  }
);
