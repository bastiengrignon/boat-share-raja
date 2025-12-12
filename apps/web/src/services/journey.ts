import type { AddPeopleToBoat, CreateJourney, EditJourney } from '@boat-share-raja/shared-types';

import { boatSharingApi } from '../lib/api';

const journeyRoute = '/journeys';

export const journeyService = {
  getAll: async () => (await boatSharingApi.get(journeyRoute)).data,
  getMyJourneys: async ({ userId }: { userId: string }) =>
    (await boatSharingApi.get(`${journeyRoute}/user/${userId}`)).data,
  addJourney: async (data: CreateJourney) => (await boatSharingApi.post(journeyRoute, data)).data,
  addPeopleToJourney: async ({ journeyId, people, user }: AddPeopleToBoat) =>
    (await boatSharingApi.post(`${journeyRoute}/${journeyId}/people`, { people, user })).data,
  updateJourney: async ({ journey }: { journey: EditJourney & { id: string } }) =>
    (await boatSharingApi.put(`${journeyRoute}/${journey.id}`, journey)).data,
  deleteJourney: async ({ journeyId }: { journeyId: string }) =>
    (await boatSharingApi.delete(`${journeyRoute}/${journeyId}`)).data,
};
