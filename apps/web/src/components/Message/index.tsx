import type { Message as MessageType } from '@boat-share-raja/shared-types';
import { Button, Flex, Group, Paper, Text } from '@mantine/core';
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useMessageHooks } from './Mesage.hooks';
import classes from './Message.module.css';

interface MessageProps {
  message: MessageType;
}

const Message: FC<MessageProps> = ({ message }) => {
  const { t } = useTranslation('messages');
  const {
    user,
    isMine,
    isExtraContent,
    isExtraContentJourneyRequest,
    acceptRequestLoading,
    declineRequestLoading,
    handleAcceptRequest,
    handleDeclineRequest,
  } = useMessageHooks({ message });

  return (
    <Group gap={0} justify={isExtraContentJourneyRequest ? 'center' : isMine ? 'flex-end' : 'flex-start'}>
      <Paper
        withBorder
        shadow="xs"
        className={clsx(classes.messageContainer, {
          [classes.messageExtraContent as string]: isExtraContent,
          [classes.messageMine as string]: isMine,
        })}
      >
        <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
          {message.extra?.type === 'JOURNEY_REQUEST' && message.senderId === user?.id
            ? t('request.yourRequest')
            : message.content}
        </Text>
        <Flex justify="flex-end">
          <Text size="xs" c={isMine ? 'dark.3' : 'dimmed'}>
            {dayjs(message.updatedAt).format('HH:mm')}
          </Text>
        </Flex>
        {isExtraContentJourneyRequest && message.senderId !== user?.id && (
          <Flex gap="xs">
            <Button
              bg="white"
              color="red"
              variant="outline"
              flex={1}
              loading={declineRequestLoading}
              onClick={handleDeclineRequest}
            >
              {t('request.decline')}
            </Button>
            <Button
              bg="white"
              color="green"
              variant="outline"
              flex={1}
              loading={acceptRequestLoading}
              onClick={handleAcceptRequest}
            >
              {t('request.accept')}
            </Button>
          </Flex>
        )}
      </Paper>
    </Group>
  );
};

export default Message;
