import { Button, Group, Modal, Text } from '@mantine/core';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface BlockUserModalProps {
  opened: boolean;
  close: () => void;
  handleSubmit: () => void;
}

const BlockUserModal: FC<BlockUserModalProps> = ({ opened, close, handleSubmit }) => {
  const { t } = useTranslation('messages');
  return (
    <Modal opened={opened} onClose={close} title={t('settings.blockUser')}>
      <Text>{t('settings.blockUserDescription')}</Text>
      <Group gap="xs" justify="flex-end">
        <Button variant="outline" onClick={close}>
          {t('common:no')}
        </Button>
        <Button color="red" onClick={handleSubmit}>
          {t('common:yes')}
        </Button>
      </Group>
    </Modal>
  );
};

export default BlockUserModal;
