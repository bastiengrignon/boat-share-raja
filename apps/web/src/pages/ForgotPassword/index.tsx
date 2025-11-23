import { Anchor, Button, Stack, TextInput } from '@mantine/core';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import AuthLayout from '../../auth-layout';
import { routes } from '../../router';
import { useForgotPasswordHooks } from './ForgotPassword.hooks';

const ForgotPassword: FC = () => {
  const { t } = useTranslation('auth');
  const { forgotPasswordForm, forgotPasswordLoading, handleSendForgotPassword } = useForgotPasswordHooks({ t });
  return (
    <AuthLayout title={t('forgotPassword.title')}>
      <form onSubmit={forgotPasswordForm.onSubmit(handleSendForgotPassword)}>
        <Stack>
          <TextInput
            required
            label={t('email')}
            placeholder={t('email')}
            key={forgotPasswordForm.key('email')}
            {...forgotPasswordForm.getInputProps('email')}
          />
          <Button type="submit" mt="xl" loading={forgotPasswordLoading}>
            {t('forgotPassword.button')}
          </Button>
          <Anchor ta="center" size="sm" component={Link} to={routes.login}>
            {t('alreadyAccount')}
          </Anchor>
        </Stack>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
