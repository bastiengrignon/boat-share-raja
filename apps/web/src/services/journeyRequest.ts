import type { JourneyRequestAcceptation } from '@boat-share-raja/shared-types';

import { boatSharingApi } from '../lib/api';

const journeyRequestRoute = '/journey-requests';

export const journeyRequestService = {
  updateJourneyRequest: async ({ accepted, requestId }: JourneyRequestAcceptation) =>
    (await boatSharingApi.patch(journeyRequestRoute, { accepted, requestId })).data,
};
