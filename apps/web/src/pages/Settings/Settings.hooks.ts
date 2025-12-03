import { hasLength, useField } from '@mantine/form';
import type { TFunction } from 'i18next';
import { useCallback } from 'react';

import { authClient } from '../../lib/auth-client';
import { useAuthSession } from '../../lib/useSession';

interface SettingsHookProp {
  t: TFunction;
}

export const useSettingsHooks = ({ t }: SettingsHookProp) => {
  const { user } = useAuthSession();

  const fullNameField = useField({
    initialValue: user?.name,
    validateOnChange: true,
    validate: hasLength({ min: 2 }, t('settings.errors.user')),
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: no Mantine form object
  const handleSaveOnBlur = useCallback(() => authClient.updateUser({ name: fullNameField.getValue() }), []);

  return {
    fullNameField,
    handleSaveOnBlur,
  };
};
