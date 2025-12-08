import { isEmail, isNotEmpty, type TransformedValues, useForm } from '@mantine/form';
import { useDisclosure, useWindowEvent } from '@mantine/hooks';
import { useMutation } from '@tanstack/react-query';
import type { TFunction } from 'i18next';
import { useCallback, useRef } from 'react';
import { matchPath, useLocation } from 'react-router';

import { useAuthSession } from '../lib/useSession';
import { routes } from '../router';
import { contactService } from '../services/contact';

const getRemainingScrollDistance = () => {
  const scrollToTop = document.documentElement.scrollTop;
  const viewportHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  return documentHeight - (scrollToTop + viewportHeight);
};

export const useLayoutHooks = () => {
  const { pathname } = useLocation();
  const matchConversation = matchPath(routes.messages.conversation, pathname);
  const matchSettings = matchPath(routes.settings, pathname);
  const footerRef = useRef<HTMLElement>(null);

  useWindowEvent('scroll', () => {
    const diff = getRemainingScrollDistance() - 30;
    if (footerRef.current) {
      const translate = diff > 0 ? diff / 2 : 0;
      footerRef.current.style.transform = `translateY(${translate}px)`;
    }
  });

  return {
    isInsideConversation: matchConversation !== null,
    isSettingsRoute: matchSettings !== null,
    footerRef,
  };
};

interface FooterHooksInputProps {
  t: TFunction;
}

export const useFooterHooks = ({ t }: FooterHooksInputProps) => {
  const { user } = useAuthSession();
  const [openedContactModal, { open: openContactModal, close: closeContactModal }] = useDisclosure(false);
  const contactUsForm = useForm({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
    validateInputOnBlur: true,
    validate: {
      name: isNotEmpty(t('')),
      email: isEmail(t('')),
      message: isNotEmpty(t('')),
    },
    transformValues: (values) => ({
      ...values,
      userId: user?.id,
    }),
  });

  const { mutate: contactFormMutation, isPending: contactFormLoading } = useMutation({
    mutationKey: ['contactForm'],
    mutationFn: contactService.sendMessage,
    onSuccess: () => {
      closeContactModal();
      contactUsForm.reset();
    },
  });

  const handleSubmitContact = useCallback(
    (values: TransformedValues<typeof contactUsForm>) => contactFormMutation(values),
    [contactFormMutation]
  );

  return {
    contactUsForm,
    openedContactModal,
    contactFormLoading,
    openContactModal,
    closeContactModal,
    handleSubmitContact,
  };
};
