import type { ApiResult } from '@boat-share-raja/shared-types';
import type { Journey } from '@prisma/client';
import dayjs from 'dayjs';
import type { FastifyRequest } from 'fastify';

export const getAllJourneys = async (
  req: FastifyRequest
): Promise<ApiResult<{ journeys: Omit<Journey, 'updatedAt'>[] }>> => {
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
};
