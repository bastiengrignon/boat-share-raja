import type { Message } from '@boat-share-raja/shared-types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { useAuthSession } from '../../lib/useSession';
import { journeyRequestService } from '../../services/journeyRequest';

interface MessageHooksInputProps {
  message: Message;
}

const journeyRequestQuery = 'journeyRequest';
const conversationQuery = 'conversation';

export const useMessageHooks = ({ message }: MessageHooksInputProps) => {
  const { user } = useAuthSession();
  const queryClient = useQueryClient();

  const { mutate: acceptRequestMutation, isPending: acceptRequestLoading } = useMutation({
    mutationKey: [journeyRequestQuery],
    mutationFn: journeyRequestService.updateJourneyRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [conversationQuery, 'messages'] });
    },
  });

  const { mutate: declineRequestMutation, isPending: declineRequestLoading } = useMutation({
    mutationKey: [journeyRequestQuery],
    mutationFn: journeyRequestService.updateJourneyRequest,
  });

  const isMine = useMemo(() => message.senderId === user?.id, [user?.id, message.senderId]);

  const isExtraContent = useMemo(() => JSON.stringify(message?.extra) !== '{}', [message?.extra]);

  const isExtraContentJourneyRequest = useMemo(
    () => isExtraContent && message?.extra?.type === 'JOURNEY_REQUEST',
    [isExtraContent, message?.extra?.type]
  );

  const handleAcceptRequest = useCallback(() => {
    if (message.extra?.id) {
      acceptRequestMutation({ accepted: true, requestId: message.extra?.id });
    }
  }, [acceptRequestMutation, message.extra?.id]);

  const handleDeclineRequest = useCallback(() => {
    if (message.extra?.id) {
      declineRequestMutation({ accepted: false, requestId: message.extra?.id });
    }
  }, [declineRequestMutation, message.extra?.id]);

  return {
    user,
    isMine,
    isExtraContent,
    isExtraContentJourneyRequest,
    acceptRequestLoading,
    declineRequestLoading,
    handleAcceptRequest,
    handleDeclineRequest,
  };
};
