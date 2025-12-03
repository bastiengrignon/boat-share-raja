import type { Journey } from '@boat-share-raja/shared-types';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useAuthSession } from '../../lib/useSession';
import { journeyService } from '../../services/journey';

const journeyQuery = 'journey';

export const useMyJourneysHooks = () => {
  const { user } = useAuthSession();
  const { data: myJourneys, isPending: myJourneysLoading } = useQuery({
    enabled: !!user,
    queryKey: [journeyQuery],
    // biome-ignore lint/style/noNonNullAssertion: user is always defined here
    queryFn: () => journeyService.getMyJourneys({ userId: user?.id! }),
  });

  const formattedJourneys = useMemo<Journey[]>(() => myJourneys?.data?.journeys || [], [myJourneys?.data?.journeys]);

  return {
    formattedJourneys,
    myJourneysLoading,
  };
};
