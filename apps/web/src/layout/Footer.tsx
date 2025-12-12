import { Anchor, Box, Button, Flex, Modal, Stack, Text, Textarea, TextInput } from '@mantine/core';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { routes } from '../router';
import { useFooterHooks } from './Layout.hooks';

const Footer: FC = () => {
  const { t } = useTranslation();
  const {
    contactUsForm,
    openedContactModal,
    contactFormLoading,
    openContactModal,
    closeContactModal,
    handleSubmitContact,
  } = useFooterHooks({ t });

  return (
    <Box w="100%">
      <Flex justify="space-between">
        <Text size="xs">{t('footer.description')}</Text>
        <Anchor size="xs" component="button" onClick={openContactModal}>
          {t('footer.contactUs')}
        </Anchor>
      </Flex>
      <Flex gap="xs" justify="center" mt="xs">
        <Anchor size="xs" component={Link} to={routes.legalNotice}>
          {t('footer.legalNotice')}
        </Anchor>
        <Anchor size="xs" component={Link} to={routes.privacyPolicy}>
          {t('footer.privacyPolicy')}
        </Anchor>
      </Flex>
      <Modal opened={openedContactModal} onClose={closeContactModal} title={t('footer.contactForm.title')}>
        <form onSubmit={contactUsForm.onSubmit(handleSubmitContact)}>
          <Stack>
            <TextInput
              data-autofocus
              required
              label={t('footer.contactForm.name')}
              {...contactUsForm.getInputProps('name')}
            />
            <TextInput required label={t('footer.contactForm.email')} {...contactUsForm.getInputProps('email')} />
            <TextInput label={t('footer.contactForm.subject')} {...contactUsForm.getInputProps('subject')} />
            <Textarea
              required
              autosize
              minRows={4}
              label={t('footer.contactForm.message')}
              {...contactUsForm.getInputProps('message')}
            />
            <Flex justify="flex-end">
              <Button type="submit" loading={contactFormLoading}>
                {t('send')}
              </Button>
            </Flex>
          </Stack>
        </form>
      </Modal>
    </Box>
  );
};

export default Footer;
