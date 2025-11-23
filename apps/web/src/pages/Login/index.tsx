import { Anchor, Button, Flex, PasswordInput, Stack, TextInput } from '@mantine/core';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import AuthLayout from '../../auth-layout';
import { routes } from '../../router';
import { useLoginHooks } from './Login.hooks';

const Login: FC = () => {
  const { t } = useTranslation('auth');
  const { loginForm, loginLoading, handleSubmitLogin } = useLoginHooks({ t });
  return (
    <AuthLayout title={t('login')}>
      <form onSubmit={loginForm.onSubmit(handleSubmitLogin)}>
        <Stack>
          <TextInput
            required
            label={t('email')}
            placeholder={t('email')}
            key={loginForm.key('email')}
            {...loginForm.getInputProps('email')}
          />
          <div>
            <PasswordInput
              required
              label={t('password')}
              placeholder={t('password')}
              key={loginForm.key('password')}
              {...loginForm.getInputProps('password')}
            />
            <Flex justify="flex-end" mt="sm">
              <Anchor size="xs" component={Link} to={routes.forgotPassword}>
                {t('forgotPassword.title')}
              </Anchor>
            </Flex>
          </div>
          <Flex align="center" justify="space-between" mt="xl">
            <Anchor size="sm" component={Link} to={routes.signup}>
              {t('noAccount')}
            </Anchor>
            <Button type="submit" loading={loginLoading}>
              {t('loginButton')}
            </Button>
          </Flex>
        </Stack>
      </form>
    </AuthLayout>
  );
};

export default Login;
