import type { EditJourney } from '@boat-share-raja/shared-types';
import type { Journey } from '@prisma/client';
import dayjs from 'dayjs';

import { createService, returnService } from '../../utils/service';

export const updateJourney = createService<{ Body: EditJourney; Params: { id: string } }, Omit<Journey, 'updatedAt'>>(
  'updateJourney',
  async (req, rep) => {
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

    return returnService(rep, {
      status: 'SUCCESS',
      data: updatedJourney,
    });
  }
);
