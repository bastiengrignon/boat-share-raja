import type { Journey } from '@prisma/client';
import dayjs from 'dayjs';
import type { RouteGenericInterface } from 'fastify';

import { createService } from '../../utils/service';

export const getAllJourneys = createService<RouteGenericInterface, { journeys: Omit<Journey, 'updatedAt'>[] }>(
  'getAllJourneys',
  async (req) => {
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

    return {
      status: 'SUCCESS',
      data: {
        journeys: formattedJourneys,
      },
    };
  }
);
