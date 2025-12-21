import { createService } from '../../utils/service';

export const checkOrCreateConversation = createService<{ Body: { userIdA: string; userIdB: string } }, string>(
  'checkOrCreateConversation',
  async (req) => {
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
  }
);
