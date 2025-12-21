import { z } from 'zod';

import { createService } from '../../utils/service';

const createConversationBodySchema = z.object({
  title: z.string().optional(),
  isGroup: z.boolean().default(false),
  participantIds: z.array(z.uuid()).min(2),
});

export const createConversation = createService<{ Body: z.infer<typeof createConversationBodySchema> }, object>(
  'createConversation',
  async (req) => {
    const parseBody = createConversationBodySchema.safeParse(req.body);
    if (!parseBody.success) {
      return {
        status: 'ERROR',
        error: parseBody.error.message,
        data: null,
      };
    }
    const { title, isGroup, participantIds } = parseBody.data;

    if (!isGroup && participantIds.length === 2) {
      const [userA, userB] = participantIds;
      const existingConversation = await req.prisma.conversation.findFirst({
        where: {
          isGroup: false,
          AND: [{ participants: { some: { userId: userA } } }, { participants: { some: { userId: userB } } }],
        },
        include: {
          participants: {
            include: {
              user: true,
            },
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });
      if (existingConversation) {
        return {
          status: 'ERROR',
          error: 'CONVERSATION_ALREADY_EXITS',
          data: null,
        };
      }
    }

    const conversation = await req.prisma.conversation.create({
      data: {
        title: isGroup ? title : null,
        isGroup,
        participants: {
          create: participantIds.map((userId) => ({ userId })),
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

    return {
      status: 'SUCCESS',
      data: {
        conversation,
      },
    };
  }
);
