import type { ApiResult, EditJourney } from '@boat-share-raja/shared-types';
import dayjs from 'dayjs';
import type { FastifyRequest } from 'fastify';

export const updateJourney = async (
  req: FastifyRequest<{ Body: EditJourney; Params: { id: string } }>
): Promise<ApiResult<object>> => {
  const body = req.body;
  const updatedJourney = await req.prisma.journey.update({
    where: {
      id: req.params.id,
    },
    data: {
      from: body.from,
      to: body.to,
      date: dayjs(body.date).toDate(),
      numberOfPeople: body.numberOfPeople,
      maxNumberOfPeople: body.maxNumberOfPeople,
      time: body.time,
      price: body.price,
      notes: body.notes,
    },
    omit: {
      updatedAt: true,
    },
  });

  return {
    status: 'SUCCESS',
    data: updatedJourney,
  };
};
