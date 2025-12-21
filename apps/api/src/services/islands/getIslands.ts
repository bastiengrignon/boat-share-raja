import type { RouteGenericInterface } from 'fastify';

import { createService } from '../../utils/service';

export const getIslands = createService<RouteGenericInterface, { islands: object }>('getIslands', async (req) => {
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
});
