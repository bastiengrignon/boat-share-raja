import { ActionIcon, Box, Divider, Flex, Group, LoadingOverlay, ScrollArea, Text, Textarea } from '@mantine/core';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TbArrowLeft, TbSend, TbSettings } from 'react-icons/tb';

import Loader from '../Loader';
import Message from '../Message';
import { useConversationHooks } from './Conversation.hooks';

const Conversation: FC = () => {
  const { t } = useTranslation('messages');
  const {
    viewPortRef,
    formattedTitle,
    messages,
    sendMessageForm,
    messagesLoading,
    conversationLoading,
    sendMessageLoading,
    backToConversations,
    handleSubmitMessage,
    handleSendMessageOnKeyDown,
  } = useConversationHooks({ t });
  return (
    <Flex direction="column" h="calc(100dvh - 28px)" gap="xs">
      <Flex align="center" justify="space-between">
        <ActionIcon variant="light" onClick={backToConversations}>
          <TbArrowLeft />
        </ActionIcon>
        {conversationLoading ? <Loader /> : <Text>{formattedTitle}</Text>}
        <ActionIcon color="gray" disabled>
          <TbSettings />
        </ActionIcon>
      </Flex>
      <Divider />
      <ScrollArea.Autosize flex={1} offsetScrollbars pos="relative" viewportRef={viewPortRef}>
        <LoadingOverlay visible={messagesLoading} />
        <Flex direction="column" gap="xs">
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        </Flex>
      </ScrollArea.Autosize>
      <Box component="form" onSubmit={sendMessageForm.onSubmit(handleSubmitMessage)}>
        <Group gap="xs">
          <Textarea
            autosize
            size="sm"
            flex={1}
            minRows={1}
            maxRows={5}
            placeholder={t('messagePlaceholder')}
            onKeyDown={handleSendMessageOnKeyDown}
            {...sendMessageForm.getInputProps('message')}
          />
          <ActionIcon size="lg" radius="xl" type="submit" loading={sendMessageLoading}>
            <TbSend />
          </ActionIcon>
        </Group>
      </Box>
    </Flex>
  );
};

export default Conversation;
