import type { ApiResult } from '@boat-share-raja/shared-types';
import type { FastifyRequest } from 'fastify';

export const getIslands = async (req: FastifyRequest): Promise<ApiResult<object>> => {
  const islands = await req.prisma.island.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  return {
    status: 'SUCCESS',
    data: {
      islands,
    },
  };
};
