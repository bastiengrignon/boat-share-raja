import { Anchor, Button, Flex, PasswordInput, Stack } from '@mantine/core';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import AuthLayout from '../../auth-layout';
import { routes } from '../../router';
import { useResetPasswordHooks } from './ResetPassword.hooks';

const ResetPassword: FC = () => {
  const { t } = useTranslation('auth');
  const { resetPasswordForm, visiblePassword, resetPasswordLoading, toggleVisiblePassword, handleSendResetPassword } =
    useResetPasswordHooks({ t });
  return (
    <AuthLayout title={t('resetPassword.title')}>
      <form onSubmit={resetPasswordForm.onSubmit(handleSendResetPassword)}>
        <Stack>
          <PasswordInput
            required
            label={t('password')}
            placeholder={t('password')}
            visible={visiblePassword}
            onVisibilityChange={toggleVisiblePassword}
            key={resetPasswordForm.key('password')}
            {...resetPasswordForm.getInputProps('password')}
          />
          <PasswordInput
            required
            label={t('confirmPassword')}
            placeholder={t('confirmPassword')}
            visible={visiblePassword}
            onVisibilityChange={toggleVisiblePassword}
            key={resetPasswordForm.key('confirmPassword')}
            {...resetPasswordForm.getInputProps('confirmPassword')}
          />
          <Flex justify="space-between" align="center" mt="xl">
            <Anchor size="sm" component={Link} to={routes.login}>
              {t('alreadyAccount')}
            </Anchor>
            <Button type="submit" loading={resetPasswordLoading}>
              {t('resetPassword.button')}
            </Button>
          </Flex>
        </Stack>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
