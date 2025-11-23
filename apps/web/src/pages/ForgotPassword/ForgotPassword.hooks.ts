import { isEmail, type TransformedValues, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import type { TFunction } from 'i18next';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { authClient } from '../../lib/auth-client';
import { useSession } from '../../lib/useSession';
import { routes } from '../../router';

interface ForgotPasswordHooksInputProps {
  t: TFunction;
}

type ForgotPasswordFormValues = {
  email: string;
};

export const useForgotPasswordHooks = ({ t }: ForgotPasswordHooksInputProps) => {
  const navigate = useNavigate();
  const { session } = useSession();

  const forgotPasswordForm = useForm<ForgotPasswordFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
    },
    validateInputOnBlur: true,
    validate: {
      email: isEmail(t('errors.emailInvalid')),
    },
    transformValues: ({ email }) => ({
      email,
      redirectTo: `${window.location.origin}${routes.resetPassword}`,
    }),
  });

  const { mutate: forgotPasswordMutation, isPending: forgotPasswordLoading } = useMutation({
    mutationFn: async (values: TransformedValues<typeof forgotPasswordForm>) =>
      await authClient.requestPasswordReset(values),
    onSuccess: async () => {
      if (session) {
        await authClient.revokeSessions();
        await authClient.signOut();
      }
      notifications.show({
        title: t('common:settings.account.emailResetTitle'),
        message: t('common:settings.account.emailResetMessage'),
        color: 'green',
      });
      navigate(routes.login);
    },
  });

  const handleSendForgotPassword = useCallback(
    async (values: TransformedValues<typeof forgotPasswordForm>) => forgotPasswordMutation(values),
    [forgotPasswordMutation]
  );

  return {
    forgotPasswordForm,
    forgotPasswordLoading,
    handleSendForgotPassword,
  };
};
