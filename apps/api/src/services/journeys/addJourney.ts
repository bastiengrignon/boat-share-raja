import type { CreateJourney } from '@boat-share-raja/shared-types';
import type { Journey } from '@prisma/client';
import dayjs from 'dayjs';

import { createService, returnService } from '../../utils/service';

export const addJourney = createService<{ Body: CreateJourney }, Omit<Journey, 'updatedAt'>>(
  'addJourney',
  async (req, rep) => {
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

    return returnService(rep, {
      status: 'SUCCESS',
      data: newJourney,
    });
  }
);
