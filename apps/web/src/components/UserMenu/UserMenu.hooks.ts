import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useAuthSession } from '../../lib/useSession';
import { conversationService } from '../../services/conversation';

const conversationQuery = 'conversation';

export const useUserMenuHooks = () => {
  const { user } = useAuthSession();

  const { data: newMessagesCount } = useQuery({
    enabled: !!user?.id,
    queryKey: [conversationQuery, user?.id],
    // biome-ignore lint/style/noNonNullAssertion: user is defined
    queryFn: () => conversationService.checkUnreadMessages({ userId: user?.id! }),
    // refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });

  const isNewMessages = useMemo(() => newMessagesCount?.data?.unreadCount > 0, [newMessagesCount?.data?.unreadCount]);

  return {
    user,
    isNewMessages,
  };
};
