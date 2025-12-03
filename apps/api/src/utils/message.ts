import type { SendMessage } from '@boat-share-raja/shared-types';
import type { Message, PrismaClient } from '@prisma/client';

export const sendMessageInConversation =
  (prisma: PrismaClient) =>
  async ({ conversationId, senderId, content, extra }: SendMessage): Promise<Message> =>
    await prisma.$transaction(async (t) => {
      const createdMessage = await t.message.create({
        data: {
          conversationId,
          senderId,
          content,
          extra: extra ?? undefined,
        },
        include: {
          sender: true,
        },
        omit: {
          createdAt: false,
        },
      });

      await t.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      });
      return createdMessage;
    });
