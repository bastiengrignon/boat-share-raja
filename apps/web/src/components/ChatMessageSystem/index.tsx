import type { Message } from '@boat-share-raja/shared-types';
import { Center, Pill } from '@mantine/core';
import type { FC } from 'react';

interface ChatMessageSystemProps {
  message: Message;
}

const ChatMessageSystem: FC<ChatMessageSystemProps> = ({ message }) => (
  <Center>
    <Pill w="70%" bd="1px solid dark.1">
      {message.content}
    </Pill>
  </Center>
);

export default ChatMessageSystem;
