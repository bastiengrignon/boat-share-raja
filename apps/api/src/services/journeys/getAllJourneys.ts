import type { Journey } from '@prisma/client';
import dayjs from 'dayjs';

import { createService, returnService } from '../../utils/service';

export const getAllJourneys = createService<object, { journeys: Omit<Journey, 'updatedAt'>[] }>(
  'getAllJourneys',
  async (req, rep) => {
    const journeys = await req.prisma.journey.findMany({
      where: {
        date: {
          lte: dayjs().startOf('day').toDate(),
        },
      },
      include: {
        user: true,
        JourneyRequest: true,
      },
      omit: {
        updatedAt: true,
      },
      orderBy: {
        date: 'desc',
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
