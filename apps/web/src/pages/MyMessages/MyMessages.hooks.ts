import type { Conversation } from '@boat-share-raja/shared-types';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useAuthSession } from '../../lib/useSession';
import { conversationService } from '../../services/conversation';

const conversationQuery = 'conversation';

export const useMyMessagesHooks = () => {
  const { user } = useAuthSession();
  const { data: conversations, isPending: allConversationsLoading } = useQuery({
    enabled: !!user,
    queryKey: [conversationQuery],
    // biome-ignore lint/style/noNonNullAssertion: user is always defined here
    queryFn: () => conversationService.getUserConversations({ userId: user?.id! }),
  });

  const formattedConversations = useMemo<Conversation[]>(
    () =>
      (conversations?.data?.conversations || []).map((conversation: Conversation) => ({
        ...conversation,
        messages: conversation.messages,
      })),
    [conversations]
  );

  return {
    formattedConversations,
    allConversationsLoading,
  };
};
