import type { ApiResult } from '@boat-share-raja/shared-types';
import type { Journey } from '@prisma/client';
import type { FastifyRequest } from 'fastify';

export const getMyJourneys = async (
  req: FastifyRequest<{ Params: { userId: string } }>
): Promise<ApiResult<{ journeys: Omit<Journey, 'updatedAt'>[] }>> => {
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
};
