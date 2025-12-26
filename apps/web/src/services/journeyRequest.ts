import type { JourneyRequestAcceptationBody, QueryRequestId } from '@boat-share-raja/shared-types';

import { boatSharingApi } from '../lib/api';

const journeyRequestRoute = '/journey-requests';

export const journeyRequestService = {
  getJourneyRequest: async ({ requestId }: QueryRequestId) =>
    (await boatSharingApi.get(`${journeyRequestRoute}/${requestId}`)).data,
  updateJourneyRequest: async ({ accepted, requestId }: JourneyRequestAcceptationBody) =>
    (await boatSharingApi.patch(journeyRequestRoute, { accepted, requestId })).data,
};
