import type { Message } from '@boat-share-raja/shared-types';
import type { FC } from 'react';

import { MESSAGE_TYPES } from '../../constants/string';
import { useAuthSession } from '../../lib/useSession';
import ChatMessage from '../ChatMessage';
import RequestChatMessage from '../RequestChatMessage';
import { useMessageRenderingHooks } from './MessageRendering.hooks';

interface MessageRenderingProps {
  message: Message;
}

const MessageRendering: FC<MessageRenderingProps> = ({ message }) => {
  const { user } = useAuthSession();
  const { request } = useMessageRenderingHooks({ message });

  return message.type === MESSAGE_TYPES.TEXT ? (
    <ChatMessage message={message} />
  ) : (
    <RequestChatMessage message={message} request={request} isRequestAuthor={message.senderId === user?.id} />
  );
};

export default MessageRendering;
