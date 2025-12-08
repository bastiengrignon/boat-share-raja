import type { Message } from '@boat-share-raja/shared-types';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { journeyRequestService } from '../../services/journeyRequest';

interface MessageRenderingHooksProps {
  message: Message;
}

export const useMessageRenderingHooks = ({ message }: MessageRenderingHooksProps) => {
  const { data } = useQuery({
    enabled: message.type === 'JOURNEY_REQUEST',
    queryKey: ['request', message.extra?.journeyRequestId],
    // biome-ignore lint/style/noNonNullAssertion: enabled only if message is a journey request
    queryFn: () => journeyRequestService.getJourneyRequest({ requestId: message.extra?.journeyRequestId! }),
  });

  const request = useMemo(() => data?.data?.journeyRequest || null, [data?.data?.journeyRequest]);

  return {
    request,
  };
};
