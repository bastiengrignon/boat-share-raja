import type { Conversation } from '@boat-share-raja/shared-types';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { TFunction } from 'i18next';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { useAuthSession } from '../../lib/useSession';
import { routes } from '../../router';
import { conversationService } from '../../services/conversation';
import { moderationService } from '../../services/moderation';

interface ConversationSettingsHooksProps {
  conversation?: Conversation;
  t: TFunction;
}

const conversationQuery = 'conversation';
const moderationQuery = 'moderation';

export const useConversationSettingsHooks = ({ conversation, t }: ConversationSettingsHooksProps) => {
  const queryClient = useQueryClient();
  const { user } = useAuthSession();
  const navigate = useNavigate();

  const [openedReportReasonModal, { open: openReportReasonModal, close: closeReportReasonModal }] =
    useDisclosure(false);
  const [openedBlockUserModal, { open: openBlockUserModal, close: closeBlockUserModal }] = useDisclosure(false);

  const { mutate: archiveConversationMutation, isPending: archiveConversationLoading } = useMutation({
    mutationKey: [conversationQuery, 'archived'],
    mutationFn: conversationService.archiveConversation,
    onSuccess: () => navigate(routes.messages.home),
  });

  const { mutate: blockUserMutation, isPending: blockUserLoading } = useMutation({
    mutationKey: [moderationQuery, 'block'],
    mutationFn: moderationService.blockUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [conversationQuery] });
      navigate(routes.messages.home);
    },
  });

  const { mutate: reportUserMutation, isPending: reportUserLoading } = useMutation({
    mutationKey: [moderationQuery, 'report'],
    mutationFn: moderationService.reportUser,
    onSuccess: () => {
      notifications.show({
        message: t('settings.reportUserSuccess'),
        color: 'green',
        position: 'bottom-center',
      });
    },
  });

  const handleReportUser = useCallback(
    (reason: string) => {
      if (user?.id && conversation?.id) {
        const userToReport = conversation.participants.find(({ userId }) => userId !== user?.id);
        if (!userToReport) return;
        reportUserMutation({ userId: user.id, reportedUserId: userToReport.userId, reason });
      }
    },
    [reportUserMutation, user?.id, conversation?.id, conversation?.participants]
  );

  const handleBlockUser = useCallback(() => {
    if (user?.id && conversation?.id) {
      const userToBlock = conversation.participants.find(({ userId }) => userId !== user?.id);
      if (!userToBlock) return;
      blockUserMutation({ userId: user.id, blockedUserId: userToBlock?.userId });
    }
  }, [blockUserMutation, conversation?.participants, conversation?.id, user?.id]);

  const handleArchiveConversation = useCallback(() => {
    if (conversation?.id && user?.id) {
      archiveConversationMutation({ conversationId: conversation?.id, userId: user.id });
    }
  }, [archiveConversationMutation, conversation?.id, user?.id]);

  return {
    reportUserLoading,
    blockUserLoading,
    openedReportReasonModal,
    openedBlockUserModal,
    archiveConversationLoading,
    openReportReasonModal,
    openBlockUserModal,
    closeReportReasonModal,
    closeBlockUserModal,
    handleReportUser,
    handleBlockUser,
    handleArchiveConversation,
  };
};
