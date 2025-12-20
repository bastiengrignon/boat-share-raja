import { createService } from '../../utils/service';

export const getIslands = createService<object, object>('getIslands', async (req) => {
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
