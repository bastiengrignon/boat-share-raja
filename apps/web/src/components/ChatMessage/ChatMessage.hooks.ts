import type { Message } from '@boat-share-raja/shared-types';
import { useMemo } from 'react';

import { useAuthSession } from '../../lib/useSession';

interface MessageHooksInputProps {
  message: Message;
}

export const useChatMessageHooks = ({ message }: MessageHooksInputProps) => {
  const { user } = useAuthSession();

  const isMine = useMemo(() => message.senderId === user?.id, [user?.id, message.senderId]);

  return {
    isMine,
  };
};
