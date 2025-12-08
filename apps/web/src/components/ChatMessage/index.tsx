import type { Message } from '@boat-share-raja/shared-types';
import { Flex, Group, Paper, Text } from '@mantine/core';
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import type { FC } from 'react';

import { useChatMessageHooks } from './ChatMessage.hooks';
import classes from './ChatMessage.module.css';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: FC<ChatMessageProps> = ({ message }) => {
  const { isMine } = useChatMessageHooks({ message });

  return (
    <Group gap={0} justify={isMine ? 'flex-end' : 'flex-start'}>
      <Paper
        withBorder
        shadow="xs"
        className={clsx(classes.messageContainer, {
          [classes.messageMine as string]: isMine,
        })}
      >
        <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
          {message.content}
        </Text>
        <Flex justify="flex-end">
          <Text size="xs" c={isMine ? 'dark.3' : 'dimmed'}>
            {dayjs(message.updatedAt).format('HH:mm')}
          </Text>
        </Flex>
      </Paper>
    </Group>
  );
};

export default ChatMessage;
