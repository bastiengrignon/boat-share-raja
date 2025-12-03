import { Box, Center, Group, LoadingOverlay, Stack, Title } from '@mantine/core';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TbMessages } from 'react-icons/tb';

import ConversationCard from '../../components/ConversationCard';
import { useMyMessagesHooks } from './MyMessages.hooks';

const MyMessages: FC = () => {
  const { t } = useTranslation('messages');
  const { formattedConversations, allConversationsLoading } = useMyMessagesHooks();

  return (
    <Stack>
      <Group gap="xs">
        <TbMessages />
        <Title order={3}>{t('myMessages')}</Title>
      </Group>
      <Box mih={250} pos="relative">
        <LoadingOverlay visible={allConversationsLoading} />
        <Stack gap="xs">
          {formattedConversations.map((conversation) => (
            <ConversationCard key={conversation.id} conversation={conversation} />
          ))}
        </Stack>
        {!allConversationsLoading && formattedConversations.length === 0 && <Center>{t('noMessages')}</Center>}
      </Box>
    </Stack>
  );
};

export default MyMessages;
