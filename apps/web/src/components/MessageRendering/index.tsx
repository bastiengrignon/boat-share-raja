import type { Message } from '@boat-share-raja/shared-types';
import type { FC } from 'react';

import { MESSAGE_TYPES } from '../../constants/string';
import { useAuthSession } from '../../lib/useSession';
import ChatMessage from '../ChatMessage';
import ChatMessageSystem from '../ChatMessageSystem';
import RequestChatMessage from '../RequestChatMessage';
import { useMessageRenderingHooks } from './MessageRendering.hooks';

interface MessageRenderingProps {
  message: Message;
}

const MessageRendering: FC<MessageRenderingProps> = ({ message }) => {
  const { user } = useAuthSession();
  const { request } = useMessageRenderingHooks({ message });

  const messageRendering = {
    [MESSAGE_TYPES.TEXT]: <ChatMessage message={message} />,
    [MESSAGE_TYPES.SYSTEM]: <ChatMessageSystem message={message} />,
    [MESSAGE_TYPES.JOURNEY_REQUEST]: (
      <RequestChatMessage message={message} request={request} isRequestAuthor={message.senderId === user?.id} />
    ),
  };

  return messageRendering[message.type];
};

export default MessageRendering;
