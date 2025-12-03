import type { Conversation } from '@boat-share-raja/shared-types';
import { useMemo } from 'react';

import { useAuthSession } from '../../lib/useSession';

interface ConversationCardHooksProps {
  conversation: Conversation;
}

export const useConversationCardHooks = ({ conversation }: ConversationCardHooksProps) => {
  const { user } = useAuthSession();
  const formattedTitle = useMemo(() => {
    const otherParticipant = conversation.participants.find((participant) => participant.userId !== user?.id);
    return conversation?.title || otherParticipant?.user.name || 'Anonymous user';
  }, [conversation.participants, conversation?.title, user?.id]);

  const lastMessage = useMemo(() => {
    const message = conversation.messages[conversation.messages.length - 1];
    return !message ? null : { user: message.sender, message: message.content };
  }, [conversation.messages]);

  const hasUnreadMessages = useMemo(() => (conversation.unreadCount ?? 0) > 0, [conversation.unreadCount]);

  return {
    user,
    lastMessage,
    formattedTitle,
    hasUnreadMessages,
  };
};
