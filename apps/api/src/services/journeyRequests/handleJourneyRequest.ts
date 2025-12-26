import type { JourneyRequestAcceptationBody } from '@boat-share-raja/shared-types';

import { AUTOMATED_MESSAGES } from '../../constants';
import { sendMessageInConversation } from '../../utils/message';
import { createService } from '../../utils/service';

export const handleJourneyRequest = createService<{ Body: JourneyRequestAcceptationBody }, object>(
  'handleJourneyRequest',
  async (req) => {
    const { accepted, requestId } = req.body;

    const journeyRequest = await req.prisma.journeyRequest.findFirst({
      where: { id: requestId },
      include: {
        journey: {
          select: {
            userId: true,
          },
        },
        requester: {
          select: {
            id: true,
          },
        },
      },
    });
    if (!journeyRequest) {
      req.log.error('Journey request not found for the given id');
      return {
        status: 'ERROR',
        error: 'REQUEST_NOT_FOUND',
        data: null,
      };
    }

    await req.prisma.journeyRequest.update({
      where: { id: journeyRequest.id },
      data: {
        status: accepted ? 'ACCEPTED' : 'DECLINED',
      },
    });

    const authorUserId = journeyRequest.journey.userId;
    const requesterUserId = journeyRequest.requester.id;

    const conversation = await req.prisma.conversation.findFirst({
      where: {
        isGroup: false,
        participants: {
          every: {
            userId: {
              in: [authorUserId, requesterUserId],
            },
          },
        },
        AND: [
          { participants: { some: { userId: authorUserId } } },
          { participants: { some: { userId: requesterUserId } } },
        ],
      },
      include: {
        participants: true,
      },
    });
    if (!conversation) {
      req.log.error('Conversation not found for the request');
      return {
        status: 'ERROR',
        error: 'CONVERSATION_NOT_FOUND',
        data: null,
      };
    }

    await sendMessageInConversation(req.prisma)({
      conversationId: conversation.id,
      senderId: authorUserId,
      content: accepted
        ? AUTOMATED_MESSAGES.REQUEST_PEOPLE_JOURNEY_ACCEPTED.fr
        : AUTOMATED_MESSAGES.REQUEST_PEOPLE_JOURNEY_DECLINED.fr,
      type: 'TEXT',
    });

    if (accepted) {
      await req.prisma.journey.update({
        where: {
          id: journeyRequest.journeyId,
        },
        data: {
          numberOfPeople: {
            increment: journeyRequest.people,
          },
        },
      });
    }

    return {
      status: 'SUCCESS',
      data: null,
    };
  }
);
