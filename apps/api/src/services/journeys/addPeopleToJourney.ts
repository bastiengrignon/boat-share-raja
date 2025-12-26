import type { AddPeopleToJourneyBody, AddPeopleToJourneyParams } from '@boat-share-raja/shared-types';

import { AUTOMATED_MESSAGES } from '../../constants';
import { sendMessageInConversation } from '../../utils/message';
import { createService } from '../../utils/service';

export const addPeopleToJourney = createService<
  { Body: AddPeopleToJourneyBody; Params: AddPeopleToJourneyParams },
  AddPeopleToJourneyParams
>('addPeopleToJourney', async (req) => {
  const { user: requesterPayload, people } = req.body;
  const { journeyId } = req.params;

  const requester = await req.prisma.user.upsert({
    where: { id: requesterPayload.id },
    update: {
      name: requesterPayload?.name,
    },
    create: {
      id: requesterPayload.id,
      name: requesterPayload.name,
    },
    select: {
      id: true,
    },
  });

  const journeyAuthor = await req.prisma.user.findFirst({
    where: {
      journeys: {
        some: {
          id: journeyId,
        },
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!journeyAuthor) {
    req.log.error('Author not found for the selected journey');
    return {
      status: 'ERROR',
      error: 'AUTHOR_NOT_FOUND',
      data: null,
    };
  }

  const journeyRequest = await req.prisma.journeyRequest.create({
    data: {
      journeyId,
      requesterId: requester.id,
      people,
      status: 'PENDING',
    },
    select: {
      id: true,
    },
  });

  let conversation = await req.prisma.conversation.findFirst({
    where: {
      isGroup: false,
      participants: {
        every: {
          userId: {
            in: [requester.id, journeyAuthor.id],
          },
        },
      },
    },
  });
  if (!conversation) {
    req.log.info('No conversation found, Creating a new conversation for people request');
    conversation = await req.prisma.conversation.create({
      data: {
        title: null,
        isGroup: false,
        participants: {
          create: [{ userId: requester.id }, { userId: journeyAuthor.id }],
        },
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  await sendMessageInConversation(req.prisma)({
    conversationId: conversation.id,
    senderId: requester.id,
    content: AUTOMATED_MESSAGES.REQUEST_PEOPLE_JOURNEY.fr(people),
    extra: { journeyRequestId: journeyRequest.id, journeyId, people },
    type: 'JOURNEY_REQUEST',
  });

  return {
    status: 'SUCCESS',
    data: {
      journeyId,
    },
  };
});
