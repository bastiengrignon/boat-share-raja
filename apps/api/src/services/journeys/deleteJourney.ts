import { sendMessageInConversation } from '../../utils/message';
import { createService, returnService } from '../../utils/service';

export const deleteJourney = createService<{ Params: { id: string } }, object>('deleteJourney', async (req, rep) => {
  const { id: journeyId } = req.params;

  const journeyToDelete = await req.prisma.journey.findFirst({
    where: {
      id: journeyId,
    },
    include: {
      user: {
        select: {
          id: true,
        },
      },
      JourneyRequest: {
        where: {
          status: 'ACCEPTED',
        },
        select: {
          requesterId: true,
        },
      },
    },
  });
  if (!journeyToDelete) {
    return returnService(rep, {
      status: 'ERROR',
      error: 'JOURNEY_NOT_FOUND',
      data: null,
    });
  }

  const authorId = journeyToDelete.user.id;
  const acceptedRequesters = journeyToDelete.JourneyRequest.map((r) => r.requesterId);

  if (acceptedRequesters.length > 0) {
    const content =
      req.language === 'en'
        ? 'The journey has been cancelled by the organizer.'
        : 'Le trajet a été annulé par l’organisateur.';

    for (const requesterId of acceptedRequesters) {
      let conversation = await req.prisma.conversation.findFirst({
        where: {
          isGroup: false,
          participants: {
            every: {
              userId: {
                in: [authorId, requesterId],
              },
            },
          },
          AND: [{ participants: { some: { userId: authorId } } }, { participants: { some: { userId: requesterId } } }],
        },
        select: { id: true },
      });

      if (!conversation) {
        conversation = await req.prisma.conversation.create({
          data: {
            title: null,
            isGroup: false,
            participants: {
              create: [{ userId: authorId }, { userId: requesterId }],
            },
          },
          select: { id: true },
        });
      }

      await sendMessageInConversation(req.prisma)({
        conversationId: conversation.id,
        senderId: authorId,
        content,
        type: 'TEXT',
      });
    }
  }
  await req.prisma.journey.delete({
    where: {
      id: journeyId,
    },
  });

  return returnService(rep, {
    status: 'SUCCESS',
    data: null,
  });
});
