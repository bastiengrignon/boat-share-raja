import { Button, Flex, Modal, Stack, Textarea } from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { type FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface ReportReasonModalProps {
  opened: boolean;
  close: () => void;
  handleSubmit: (reason: string) => void;
  loading: boolean;
}

const ReportReasonModal: FC<ReportReasonModalProps> = ({ opened, close, handleSubmit, loading }) => {
  const { t } = useTranslation('messages');

  const rreportReasonForm = useForm({
    initialValues: {
      reason: '',
    },
    validateInputOnBlur: true,
    validate: {
      reason: isNotEmpty(t('settings.reportUserReasonError')),
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies:no Mantine form
  const handleCloseModal = useCallback(() => {
    rreportReasonForm.reset();
    close();
  }, [close]);

  const handleOnSubmit = useCallback(
    async ({ reason }: typeof rreportReasonForm.values) => {
      await handleSubmit(reason);
      handleCloseModal();
    },
    [handleSubmit, handleCloseModal]
  );

  return (
    <Modal opened={opened} onClose={handleCloseModal} title={t('settings.reportUser')}>
      <form onSubmit={rreportReasonForm.onSubmit(handleOnSubmit)}>
        <Stack>
          <Textarea
            autosize
            minRows={4}
            label={t('settings.reportUserReason')}
            placeholder={t('settings.reportUserReasonDescription')}
            {...rreportReasonForm.getInputProps('reason')}
          />
          <Flex justify="flex-end">
            <Button type="submit" loading={loading}>
              {t('common:send')}
            </Button>
          </Flex>
        </Stack>
      </form>
    </Modal>
  );
};

export default ReportReasonModal;
