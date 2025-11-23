import { hasLength, isEmail, matches, matchesField, type TransformedValues, useForm } from '@mantine/form';
import { useDisclosure, useInputState } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import type { TFunction } from 'i18next';
import { type ChangeEvent, useCallback, useEffect, useRef } from 'react';

import { REGEXPS } from '../../constants/regexp';
import { authClient } from '../../lib/auth-client';
import { useSession } from '../../lib/useSession';
import { routes } from '../../router';

type ResetPasswordValues = {
  email: string;
  redirectTo: string;
};

interface SettingsHooksInputProps {
  t: TFunction;
}

export const useSettingsHooks = ({ t }: SettingsHooksInputProps) => {
  const { user, session } = useSession();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [emailAddressConfirmDeleteAccount, setEmailAddressConfirmDeleteAccount] = useInputState('');
  const [visiblePassword, { toggle: toggleVisiblePassword }] = useDisclosure(false);
  const [openedDeleteAccountModal, { open: openDeleteAccountModal, close: closeDeleteAccountModal }] =
    useDisclosure(false);

  const userForm = useForm({
    mode: 'uncontrolled',
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
    validateInputOnBlur: true,
    validate: {
      firstName: hasLength({ min: 2 }, t('auth:errors.firstName')),
      lastName: hasLength({ min: 2 }, t('auth:errors.lastName')),
      email: isEmail(t('auth:errors.emailInvalid')),
    },
    transformValues: ({ firstName, lastName }) => ({
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
    }),
  });
  const updatePasswordForm = useForm({
    mode: 'uncontrolled',
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    validateInputOnBlur: true,
    validate: {
      newPassword: matches(REGEXPS.PASSWORD, t('auth:errors.passwordRegexp')),
      confirmNewPassword: matchesField('newPassword', t('auth:errors.confirmPassword')),
    },
    transformValues: ({ currentPassword, newPassword }) => ({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    }),
  });

  const { mutate: updateUserMutation, isPending: updateUserLoading } = useMutation({
    mutationFn: async (values: TransformedValues<typeof userForm>) => await authClient.updateUser(values),
    onError: (error) => {
      notifications.show({
        title: t('error'),
        message: error.message,
        color: 'red',
      });
    },
  });

  const { mutate: updatePasswordMutation, isPending: updatePasswordLoading } = useMutation({
    mutationFn: (values: TransformedValues<typeof updatePasswordForm>) => authClient.changePassword(values),
    onError: (error) => {
      notifications.show({
        title: t('error'),
        message: error.message,
        color: 'red',
      });
    },
  });

  const { mutate: resetPasswordMutation, isPending: resetPasswordLoading } = useMutation({
    mutationFn: (values: ResetPasswordValues) => authClient.requestPasswordReset(values),
    onSuccess: async () => {
      if (session) {
        await authClient.revokeSessions();
        await authClient.signOut();
      }
      notifications.show({
        title: t('settings.account.emailResetTitle'),
        message: t('settings.account.emailResetMessage'),
      });
    },
  });

  const handleUpdateProfilePicture = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleUploadProfilePicture = useCallback(({ target: { files } }: ChangeEvent<HTMLInputElement>) => {
    if ((files?.length || 0) > 0) {
      //Handle file uploading
    }
  }, []);

  const handleUpdateUser = useCallback(
    (values: TransformedValues<typeof userForm>) => updateUserMutation(values),
    [updateUserMutation]
  );

  const handleUpdatePassword = useCallback(
    (values: TransformedValues<typeof updatePasswordForm>) => updatePasswordMutation(values),
    [updatePasswordMutation]
  );

  const handleResetPassword = useCallback(async () => {
    if (user?.email) {
      resetPasswordMutation({
        email: user.email,
        redirectTo: `${window.location.origin}${routes.resetPassword}`,
      });
    }
  }, [resetPasswordMutation, user?.email]);

  const handleDeleteAccount = useCallback(async () => await authClient.deleteUser(), []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: no Mantine form object in dependencies
  useEffect(() => {
    if (user) {
      userForm.setValues({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
  }, [user]);

  return {
    fileInputRef,
    user,
    userForm,
    updatePasswordForm,
    openedDeleteAccountModal,
    emailAddressConfirmDeleteAccount,
    visiblePassword,
    updateUserLoading,
    updatePasswordLoading,
    resetPasswordLoading,
    setEmailAddressConfirmDeleteAccount,
    toggleVisiblePassword,
    openDeleteAccountModal,
    closeDeleteAccountModal,
    handleUpdateProfilePicture,
    handleUploadProfilePicture,
    handleUpdateUser,
    handleUpdatePassword,
    handleResetPassword,
    handleDeleteAccount,
  };
};
