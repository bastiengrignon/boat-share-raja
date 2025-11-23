import { matches, matchesField, type TransformedValues, useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import type { TFunction } from 'i18next';
import { useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { REGEXPS } from '../../constants/regexp';
import { authClient } from '../../lib/auth-client';
import { routes } from '../../router';

interface ResetPasswordHooksInputProps {
  t: TFunction;
}

export const useResetPasswordHooks = ({ t }: ResetPasswordHooksInputProps) => {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const token = search.get('token') || undefined;

  const [visiblePassword, { toggle: toggleVisiblePassword }] = useDisclosure(false);

  const resetPasswordForm = useForm({
    mode: 'uncontrolled',
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validateInputOnBlur: true,
    validate: {
      password: matches(REGEXPS.PASSWORD, t('errors.passwordRegexp')),
      confirmPassword: matchesField('password', t('errors.confirmPassword')),
    },
    transformValues: ({ password }) => ({
      newPassword: password,
      token,
    }),
  });

  const { mutate: resetPasswordMutation, isPending: resetPasswordLoading } = useMutation({
    mutationFn: (values: TransformedValues<typeof resetPasswordForm>) => authClient.resetPassword(values),
    onSuccess: () => {
      notifications.show({
        message: t('resetPassword.success'),
        color: 'green',
      });
      navigate(routes.login);
    },
    onError: (error: { code: string; message: string }) => {
      notifications.show({
        title: error.code,
        message: error.message,
        color: 'red',
      });
    },
  });

  const handleSendResetPassword = useCallback(
    async (values: TransformedValues<typeof resetPasswordForm>) => {
      if (token) {
        resetPasswordMutation(values);
      } else {
        notifications.show({
          title: t('common:error'),
          message: t('resetPassword.errors.invalidToken'),
          color: 'red',
        });
      }
    },
    [resetPasswordMutation, t, token]
  );

  return {
    resetPasswordForm,
    visiblePassword,
    resetPasswordLoading,
    toggleVisiblePassword,
    handleSendResetPassword,
  };
};
