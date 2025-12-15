import type { Conversation } from '@boat-share-raja/shared-types';
import { ActionIcon, Menu } from '@mantine/core';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TbArchive, TbSettings, TbUserCancel, TbUserExclamation } from 'react-icons/tb';

import Loader from '../Loader';
import { useConversationSettingsHooks } from './ConversationSettings.hooks';
import ReportReasonModal from './ReportReasonModal';

interface ConversationSettingsProps {
  conversation?: Conversation;
}

const ConversationSettings: FC<ConversationSettingsProps> = ({ conversation }) => {
  const { t } = useTranslation('messages');
  const {
    reportUserLoading,
    blockUserLoading,
    openedReportReasonModal,
    archiveConversationLoading,
    openReportReasonModal,
    closeReportReasonModal,
    handleReportUser,
    handleBlockUser,
    handleArchiveConversation,
  } = useConversationSettingsHooks({
    conversation,
    t,
  });
  return (
    <>
      <Menu withArrow position="bottom-end">
        <Menu.Target>
          <ActionIcon variant="light">
            <TbSettings />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            leftSection={reportUserLoading ? <Loader /> : <TbUserExclamation />}
            onClick={openReportReasonModal}
          >
            {t('settings.reportUser')}
          </Menu.Item>
          <Menu.Item leftSection={blockUserLoading ? <Loader /> : <TbUserCancel />} onClick={handleBlockUser}>
            {t('settings.blockUser')}
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            leftSection={archiveConversationLoading ? <Loader /> : <TbArchive />}
            color="red"
            onClick={handleArchiveConversation}
          >
            {t('settings.archiveConversation')}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <ReportReasonModal
        opened={openedReportReasonModal}
        close={closeReportReasonModal}
        handleSubmit={handleReportUser}
        loading={reportUserLoading}
      />
    </>
  );
};

export default ConversationSettings;
