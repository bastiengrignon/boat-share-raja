import { Box, Card, Fieldset, Group, LoadingOverlay, Stack, Text, TextInput, Title } from '@mantine/core';
import dayjs from 'dayjs';
import type { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { TbSettings } from 'react-icons/tb';

import { DATE_READABLE_FORMAT } from '../../constants/string';
import { useSettingsHooks } from './Settings.hooks';

const Settings: FC = () => {
  const { t } = useTranslation();
  const { fullNameField, archivedConversations, archivedConversationsLoading, handleSaveOnBlur } = useSettingsHooks({
    t,
  });
  return (
    <Stack>
      <Group>
        <TbSettings />
        <Title order={3}>{t('settings.title')}</Title>
      </Group>
      <Fieldset legend={t('settings.user')}>
        <TextInput {...fullNameField.getInputProps()} onBlur={handleSaveOnBlur} />
      </Fieldset>
      <Fieldset legend={t('settings.conversations.title')}>
        <Box pos="relative" mih={archivedConversationsLoading && archivedConversations.length === 0 ? 50 : 0}>
          <LoadingOverlay visible={archivedConversationsLoading} />
          {archivedConversations.map((archivedConversation) => (
            <Card key={archivedConversation.id} withBorder padding="xs">
              <Text size="sm">
                <Trans
                  i18nKey="settings.conversations.archivedText"
                  components={{ italic: <Text fs="italic" fw="bold" component="span" /> }}
                  values={{
                    user: archivedConversation.otherUser.name,
                    date: dayjs(archivedConversation.archivedAt).format(DATE_READABLE_FORMAT),
                  }}
                />
              </Text>
            </Card>
          ))}
          {!archivedConversationsLoading && archivedConversations.length === 0 && (
            <Text ta="center">{t('settings.conversations.noArchivedConversations')}</Text>
          )}
        </Box>
      </Fieldset>
    </Stack>
  );
};

export default Settings;
