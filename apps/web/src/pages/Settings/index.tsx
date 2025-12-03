import { Fieldset, Group, Stack, TextInput, Title } from '@mantine/core';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TbSettings } from 'react-icons/tb';

import { useSettingsHooks } from './Settings.hooks';

const Settings: FC = () => {
  const { t } = useTranslation();
  const { fullNameField, handleSaveOnBlur } = useSettingsHooks({ t });
  return (
    <Stack>
      <Group>
        <TbSettings />
        <Title order={3}>{t('settings.title')}</Title>
      </Group>

      <Fieldset legend={t('settings.user')}>
        <TextInput {...fullNameField.getInputProps()} onBlur={handleSaveOnBlur} />
      </Fieldset>
    </Stack>
  );
};

export default Settings;
