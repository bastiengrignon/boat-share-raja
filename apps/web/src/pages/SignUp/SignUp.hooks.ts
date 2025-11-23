import { hasLength, isEmail, matches, matchesField, type TransformedValues, useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import type { TFunction } from 'i18next';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { ERROR_CODES } from '../../constants/error-codes';
import { REGEXPS } from '../../constants/regexp';
import { authClient } from '../../lib/auth-client';
import { routes } from '../../router';

interface SignUpHooksInputProps {
  t: TFunction;
}

export const useSignUpHooks = ({ t }: SignUpHooksInputProps) => {
  const navigate = useNavigate();

  const [visiblePassword, { toggle: toggleVisiblePassword }] = useDisclosure(false);

  const registerForm = useForm({
    mode: 'uncontrolled',
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validateInputOnBlur: true,
    validate: {
      firstName: hasLength({ min: 2 }, t('errors.firstName')),
      lastName: hasLength({ min: 2 }, t('errors.lastName')),
      email: isEmail(t('errors.emailInvalid')),
      password: matches(REGEXPS.PASSWORD, t('errors.passwordRegexp')),
      confirmPassword: matchesField('password', t('errors.confirmPassword')),
    },
    transformValues: ({ firstName, lastName, email, password }) => ({
      firstName,
      lastName,
      email,
      password,
      name: `${firstName} ${lastName}`,
    }),
  });

  const { mutate: registerMutation, isPending: registerLoading } = useMutation({
    mutationFn: (values: TransformedValues<typeof registerForm>) => authClient.signUp.email(values),
    onSuccess: ({ error }) => {
      if (error) {
        if (
          error.code === ERROR_CODES.USER_ALREADY_EXISTS ||
          error.code === ERROR_CODES.USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL
        ) {
          registerForm.setFieldError('email', error.message);
          return;
        }
        notifications.show({
          title: t('common:error'),
          message: error.message,
          color: 'red',
        });
      } else {
        navigate(routes.login);
      }
    },
  });

  const handleRegister = useCallback(
    async (values: TransformedValues<typeof registerForm>) => registerMutation(values),
    [registerMutation]
  );

  return {
    registerForm,
    visiblePassword,
    registerLoading,
    handleRegister,
    toggleVisiblePassword,
  };
};
