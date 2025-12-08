import type { ApiResult } from '@boat-share-raja/shared-types';
import type { FastifyRequest } from 'fastify';

export const checkOrCreateConversation = async (
  req: FastifyRequest<{ Body: { userIdA: string; userIdB: string } }>
): Promise<ApiResult<string>> => {
  const { userIdA, userIdB } = req.body;

  const existingConversation = await req.prisma.conversation.findFirst({
    where: {
      isGroup: false,
      AND: [{ participants: { some: { userId: userIdA } } }, { participants: { some: { userId: userIdB } } }],
    },
    select: {
      id: true,
    },
  });
  if (existingConversation) {
    req.log.info('Conversation found, returning already created conversation');
    return {
      status: 'SUCCESS',
      data: existingConversation.id,
    };
  }

  const createdConversation = await req.prisma.conversation.create({
    data: {
      isGroup: false,
      title: null,
      participants: {
        create: [{ userId: userIdA }, { userId: userIdB }],
      },
    },
    select: { id: true },
  });
  req.log.info('Conversation created, returning newly created conversation');

  return {
    status: 'SUCCESS',
    data: createdConversation.id,
  };
};
