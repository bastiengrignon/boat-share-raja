import { isEmail, matches, type TransformedValues, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import type { TFunction } from 'i18next';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { REGEXPS } from '../../constants/regexp';
import { authClient } from '../../lib/auth-client';
import { routes } from '../../router';

type LoginFormValues = {
  email: string;
  password: string;
};

interface LoginHooksInputProps {
  t: TFunction;
}

export const useLoginHooks = ({ t }: LoginHooksInputProps) => {
  const navigate = useNavigate();

  const loginForm = useForm<LoginFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
    },
    validateInputOnBlur: true,
    validate: {
      email: isEmail(t('errors.emailInvalid')),
      password: matches(REGEXPS.PASSWORD, t('errors.passwordInvalid')),
    },
  });

  const { mutate: loginMutation, isPending: loginLoading } = useMutation({
    mutationFn: async (values: LoginFormValues) => await authClient.signIn.email(values),
    onSuccess: () => navigate(routes.home),
    onError: (error) => {
      notifications.show({
        title: t('common:error'),
        message: error.message,
        color: 'red',
      });
    },
  });

  const handleSubmitLogin = useCallback(
    (values: TransformedValues<typeof loginForm>) => loginMutation(values),
    [loginMutation]
  );

  return {
    loginForm,
    loginLoading,
    handleSubmitLogin,
  };
};
