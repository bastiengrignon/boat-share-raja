import type { ApiResult, CreateJourney } from '@boat-share-raja/shared-types';
import dayjs from 'dayjs';
import type { FastifyRequest } from 'fastify';

export const addJourney = async (req: FastifyRequest<{ Body: CreateJourney }>): Promise<ApiResult<object>> => {
  const body = req.body;
  const newJourney = await req.prisma.journey.create({
    data: {
      from: body.from,
      to: body.to,
      date: dayjs(body.date).toDate(),
      numberOfPeople: body.numberOfPeople,
      maxNumberOfPeople: body.maxNumberOfPeople,
      time: body.time,
      price: body.price,
      notes: body.notes,
      user: {
        connectOrCreate: {
          create: {
            id: body.user.id,
            name: body.user.name,
          },
          where: {
            id: body.user.id,
          },
        },
      },
    },
    omit: {
      updatedAt: true,
    },
  });

  return {
    status: 'SUCCESS',
    data: newJourney,
  };
};
