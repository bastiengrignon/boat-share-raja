import type { ApiResult } from '@boat-share-raja/shared-types';
import type { FastifyRequest } from 'fastify';

export const getJourneyRequest = async (
  req: FastifyRequest<{ Params: { requestId: string } }>
): Promise<ApiResult<object>> => {
  const { requestId } = req.params;
  const journeyRequest = await req.prisma.journeyRequest.findFirst({
    where: {
      id: requestId,
    },
    include: {
      journey: true,
    },
  });
  if (!journeyRequest) {
    return {
      status: 'ERROR',
      error: 'REQUEST_NOT_FOUND',
      data: null,
    };
  }

  return {
    status: 'SUCCESS',
    data: {
      journeyRequest,
    },
  };
};
