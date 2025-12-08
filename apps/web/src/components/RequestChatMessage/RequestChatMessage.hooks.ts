import type { JourneyRequest, Message } from '@boat-share-raja/shared-types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { journeyRequestService } from '../../services/journeyRequest';

const journeyRequestQuery = 'journeyRequest';
const conversationQuery = 'conversation';

interface RequestChatMessageHooksInputProps {
  message: Message;
  request: JourneyRequest | null;
}

export const useRequestChatMessageHooks = ({ message, request }: RequestChatMessageHooksInputProps) => {
  const queryClient = useQueryClient();

  const { mutate: acceptRequestMutation, isPending: acceptRequestLoading } = useMutation({
    mutationKey: [journeyRequestQuery],
    mutationFn: journeyRequestService.updateJourneyRequest,
    onSuccess: async () =>
      await queryClient.invalidateQueries({ queryKey: [conversationQuery, 'messages', message.conversationId] }),
  });

  const { mutate: declineRequestMutation, isPending: declineRequestLoading } = useMutation({
    mutationKey: [journeyRequestQuery],
    mutationFn: journeyRequestService.updateJourneyRequest,
    onSuccess: async () =>
      await queryClient.invalidateQueries({ queryKey: [conversationQuery, 'messages', message.conversationId] }),
  });

  const handleAcceptRequest = useCallback(() => {
    if (request?.id) {
      acceptRequestMutation({ accepted: true, requestId: request.id });
    }
  }, [acceptRequestMutation, request?.id]);

  const handleDeclineRequest = useCallback(() => {
    if (request?.id) {
      declineRequestMutation({ accepted: false, requestId: request.id });
    }
  }, [declineRequestMutation, request?.id]);

  return {
    acceptRequestLoading,
    declineRequestLoading,
    handleAcceptRequest,
    handleDeclineRequest,
  };
};
