import type { Conversation } from '@boat-share-raja/shared-types';
import { Avatar, Box, Flex, Indicator, Paper, Text, Title, UnstyledButton } from '@mantine/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { replaceRouteParams } from '../../lib/router';
import { routes } from '../../router';
import { useConversationCardHooks } from './ConversationCard.hooks';

interface ConversationProps {
  conversation: Conversation;
}

dayjs.extend(relativeTime);

const ConversationCard: FC<ConversationProps> = ({ conversation }) => {
  const { t } = useTranslation('messages');
  const { user, lastMessage, formattedTitle, hasUnreadMessages } = useConversationCardHooks({ conversation });

  return (
    <UnstyledButton
      component={Link}
      to={replaceRouteParams(routes.messages.conversation, { conversationId: conversation.id })}
    >
      <Paper withBorder p="sm">
        <Flex align="center" gap="xs">
          <Avatar color="initials" name={formattedTitle} />
          <Box w="100%">
            <Flex justify="space-between">
              <Title order={4}>{formattedTitle}</Title>
              <Text size="xs" fs="italic">
                {dayjs(conversation.updatedAt).fromNow()}
              </Text>
            </Flex>
            <Flex align="center" justify="space-between">
              <Text size="sm" lineClamp={1}>
                {lastMessage && (
                  <Trans
                    i18nKey="messages:lastMessage"
                    values={{
                      name: user?.id === lastMessage.user?.id ? t('lastMessageUserMe') : lastMessage.user?.name,
                      message: lastMessage.message,
                    }}
                    components={{ b: <strong /> }}
                  />
                )}
              </Text>
              <Indicator mr="xs" disabled={!hasUnreadMessages} />
            </Flex>
          </Box>
        </Flex>
      </Paper>
    </UnstyledButton>
  );
};

export default ConversationCard;
