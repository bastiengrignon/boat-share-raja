import type { RouteGenericInterface } from 'fastify';

import { createService, returnService } from '../../utils/service';

export const getIslands = createService<RouteGenericInterface, { islands: object }>('getIslands', async (req, rep) => {
  const islands = await req.prisma.island.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  return returnService(rep, {
    status: 'SUCCESS',
    data: {
      islands,
    },
  });
});
