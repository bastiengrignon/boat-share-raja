import type { ArchivedConversation } from '@boat-share-raja/shared-types';
import { hasLength, useField } from '@mantine/form';
import { useQuery } from '@tanstack/react-query';
import type { TFunction } from 'i18next';
import { useCallback, useEffect, useMemo } from 'react';

import { authClient } from '../../lib/auth-client';
import { useAuthSession } from '../../lib/useSession';
import { conversationService } from '../../services/conversation';

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

  const { data, isPending: archivedConversationsLoading } = useQuery({
    enabled: !!user,
    queryKey: ['archivedConversations', user?.id],
    // biome-ignore lint/style/noNonNullAssertion: user is always defined here
    queryFn: () => conversationService.getArchivedConversations({ userId: user!.id }),
  });

  const archivedConversations = useMemo<ArchivedConversation[]>(
    () => data?.data?.archivedConversations || [],
    [data?.data?.archivedConversations]
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: no Mantine form object
  const handleSaveOnBlur = useCallback(() => authClient.updateUser({ name: fullNameField.getValue() }), []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: no Mantine form object
  useEffect(() => {
    if (user?.name) {
      fullNameField.setValue(user.name);
    }
  }, [user?.name]);

  return {
    fullNameField,
    archivedConversations,
    archivedConversationsLoading,
    handleSaveOnBlur,
  };
};
